import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';

const DocumentUpload = ({ onComplete, onBack, onSkip, isLoading }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [documentType, setDocumentType] = useState('Aadhaar');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }
    if (file.size > maxFileSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFiles = (files) => {
    // Clear previous files - only allow one document at a time
    setUploadedFiles([]);
    
    if (files.length === 0) return;
    
    // Take only the first file
    const file = files[0];
    const error = validateFile(file);
    
    if (error) {
      alert(error);
      return;
    }
    
    const fileObject = {
      id: Date.now(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    };
    
    setUploadedFiles([fileObject]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(file => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleContinue = () => {
    // Complete with document data
    if (uploadedFiles.length > 0) {
      const documentData = {
        documentPhoto: uploadedFiles[0].file,
        documentType
      };
      onComplete(documentData);
    } else {
      onComplete({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Upload" size={32} color="#4a7c59" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          Upload Identity Documents
        </h3>
        <p className="text-text-secondary">
          Upload your Aadhaar Card or PAN Card for verification (Optional)
        </p>
      </div>

      {/* Document Type Selection */}
      <div>
        <label className="form-label">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="form-select"
          disabled={isLoading}
        >
          <option value="Aadhaar">Aadhaar Card</option>
          <option value="PAN">PAN Card</option>
          <option value="Ration Card">Ration Card</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-smooth 
          ${dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-border hover:border-primary'}
          ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          disabled={isLoading}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <Icon name="UploadCloud" size={40} className="text-secondary" />
          <p className="font-medium text-text-primary">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-text-secondary">
            PNG, JPG or PDF (max. 5MB)
          </p>
          <div className="flex space-x-4 text-xs text-text-secondary mt-2">
            <div className="flex items-center space-x-1">
              <Icon name="Image" size={14} />
              <span>Image Files</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="File" size={14} />
              <span>PDF Document</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CreditCard" size={14} />
              <span>Aadhaar Card</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="FileText" size={14} />
              <span>PAN Card</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary">Uploaded Documents</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 p-3 bg-background rounded-md border border-border">
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-accent rounded flex items-center justify-center">
                    <Icon name="FileText" size={20} color="#4a7c59" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="flex-shrink-0 p-1 text-text-secondary hover:text-error transition-smooth"
                disabled={isLoading}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-accent bg-opacity-30 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-secondary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium mb-1">Why do we need these documents?</p>
            <ul className="space-y-1 text-xs">
              <li>• To verify your identity and prevent fraud</li>
              <li>• To comply with government regulations</li>
              <li>• To ensure authentic community membership</li>
              <li>• Documents are stored securely and never shared</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 btn-outline flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back</span>
        </button>
        
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading}
          className="flex-1 btn-primary flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Icon name="CheckCircle" size={20} />
              <span>Complete Registration</span>
            </>
          )}
        </button>
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          className="text-text-secondary text-sm hover:text-primary hover:underline"
        >
          Skip document upload for now
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;
