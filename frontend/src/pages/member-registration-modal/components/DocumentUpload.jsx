import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

const DocumentUpload = ({ onComplete, onBack, onSkip, isLoading }) => {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const validateFile = (file) => {
    setError(null);
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError(language === 'en' ? 'Invalid file format. Only JPG, PNG, and PDF files are allowed.' : 'अमान्य फ़ाइल प्रारूप। केवल JPG, PNG और PDF फाइलें अनुमत हैं।');
      return false;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(language === 'en' ? 'File size exceeds the 5MB limit.' : 'फ़ाइल का आकार 5MB की सीमा से अधिक है।');
      return false;
    }
    
    return true;
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };
  
  const handleFileSelection = (selectedFile) => {
    if (!validateFile(selectedFile)) {
      return;
    }
    
    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Show a generic icon for PDFs
      setPreviewUrl(null);
    }
    
    // Simulate upload
    simulateUpload();
  };
  
  const handleSelectFile = () => {
    fileInputRef.current.click();
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const simulateUpload = () => {
    setUploadProgress(0);
    setUploadStatus(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const handleSubmit = () => {
    if (!file && !documentType) {
      setError(language === 'en' ? 'Please select a document type.' : 'कृपया एक दस्तावेज़ प्रकार चुनें।');
      return;
    }
    
    onComplete({
      documentPhoto: file,
      documentType: documentType || 'Not Provided'
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          <TranslateText translationKey="uploadYourDocument">Upload Your Document</TranslateText>
        </h3>
        <p className="text-sm text-text-secondary">
          <TranslateText translationKey="uploadDocumentDesc">
            Please upload an identity document for verification of your membership
          </TranslateText>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-error bg-opacity-10 p-3 border-l-4 border-error">
          <div className="flex">
            <Icon name="AlertTriangle" size={18} className="text-error mr-2 mt-0.5" />
            <p className="text-sm text-error">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      {!file && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary bg-opacity-5' : 'border-border hover:border-primary hover:bg-accent hover:bg-opacity-10'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleSelectFile}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileInputChange}
          />
          
          <Icon name="Upload" size={32} className="mx-auto mb-4 text-text-secondary" />
          
          <p className="text-text-primary font-medium mb-2">
            <TranslateText translationKey="dragAndDrop">
              Drag and drop your file here or browse
            </TranslateText>
          </p>
          
          <p className="text-text-secondary text-sm mb-4">
            <TranslateText translationKey="supportedFormats">
              Supported formats: JPG, PNG, PDF (max 5MB)
            </TranslateText>
          </p>
          
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
          >
            <TranslateText translationKey="browse">Browse</TranslateText>
          </button>
        </div>
      )}

      {/* Preview */}
      {file && (
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                <Icon name={file.type.startsWith('image/') ? 'Image' : 'File'} size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-text-primary font-medium">{file.name}</p>
                <p className="text-xs text-text-secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setUploadStatus(null);
              }}
              className="text-text-secondary hover:text-error transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Upload Progress */}
          {uploadStatus !== 'success' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">
                  <TranslateText translationKey="uploadingDocument">Uploading document...</TranslateText> {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="flex items-center text-success mb-4">
              <Icon name="CheckCircle" size={16} className="mr-2" />
              <span className="text-sm">
                <TranslateText translationKey="uploadSuccess">Document uploaded successfully!</TranslateText>
              </span>
            </div>
          )}

          {/* Preview Image */}
          {previewUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border border-border">
              <img
                src={previewUrl}
                alt="Document preview"
                className="w-full object-contain max-h-48"
              />
            </div>
          )}
        </div>
      )}

      {/* Document Type */}
      <div>
        <label className="form-label mb-2">
          <TranslateText translationKey="documentType">Document Type</TranslateText>
        </label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="form-select"
          disabled={isLoading}
        >
          <option value="">
            {language === 'en' ? 'Select document type' : 'दस्तावेज़ का प्रकार चुनें'}
          </option>
          <option value="Aadhar Card">
            {language === 'en' ? 'Aadhar Card' : 'आधार कार्ड'}
          </option>
          <option value="Voter ID">
            {language === 'en' ? 'Voter ID' : 'वोटर आईडी'}
          </option>
          <option value="PAN Card">
            {language === 'en' ? 'PAN Card' : 'पैन कार्ड'}
          </option>
          <option value="Driving License">
            {language === 'en' ? 'Driving License' : 'ड्राइविंग लाइसेंस'}
          </option>
          <option value="Other">
            {language === 'en' ? 'Other' : 'अन्य'}
          </option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeft" size={18} />
          <span>
            <TranslateText translationKey="backToInformation">Back to Information</TranslateText>
          </span>
        </button>
        
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          className="btn-text flex-1"
        >
          <TranslateText translationKey="skipThisStep">Skip this step</TranslateText>
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>
                <TranslateText translationKey="continueToConfirmation">Continue to Confirmation</TranslateText>
              </span>
              <Icon name="ArrowRight" size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;