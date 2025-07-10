import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';
import { API_BASE_URL } from '../../../config/constants';

const DocumentUpload = ({ formData, onComplete, onBack, isLoading }) => {
  const { language } = useLanguage();
  const [localData, setLocalData] = useState({
    aadharCard: formData.documents?.aadharCard || null,
    photograph: formData.documents?.photograph || null,
    additionalDocument: formData.documents?.additionalDocument || null,
    additionalDocumentType: formData.documents?.additionalDocumentType || 'none',
    additionalDocumentUrl: formData.documents?.additionalDocumentUrl || '',
  });
  
  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState({
    aadharCard: null,
    photograph: null,
    additionalDocument: null
  });
  
  const aadharCardRef = useRef(null);
  const photographRef = useRef(null);
  const additionalDocRef = useRef(null);
  
  const [isDraggingAadhar, setIsDraggingAadhar] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false);

  const validateFile = (file, type) => {
    // Clear existing errors for this file type
    setErrors(prev => ({ ...prev, [type]: null }));
    
    if (!file) {
      return true;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [type]: language === 'en' 
          ? 'File size exceeds the 5MB limit.' 
          : 'फ़ाइल का आकार 5MB की सीमा से अधिक है।'
      }));
      return false;
    }
    
    // Check file type
    let allowedTypes = [];
    
    if (type === 'additionalDocument' && localData.additionalDocumentType === 'video_file') {
      allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: language === 'en'
            ? 'Invalid video format. Only MP4, MOV, and AVI files are allowed.'
            : 'अमान्य वीडियो प्रारूप। केवल MP4, MOV, और AVI फाइलें अनुमत हैं।'
        }));
        return false;
      }
    } else {
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: language === 'en'
            ? 'Invalid file format. Only JPG, PNG, and PDF files are allowed.'
            : 'अमान्य फ़ाइल प्रारूप। केवल JPG, PNG और PDF फाइलें अनुमत हैं।'
        }));
        return false;
      }
    }
    
    return true;
  };

  const handleDragEnter = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === 'aadharCard') setIsDraggingAadhar(true);
    else if (fileType === 'photograph') setIsDraggingPhoto(true);
    else if (fileType === 'additionalDocument') setIsDraggingAdditional(true);
  };
  
  const handleDragLeave = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === 'aadharCard') setIsDraggingAadhar(false);
    else if (fileType === 'photograph') setIsDraggingPhoto(false);
    else if (fileType === 'additionalDocument') setIsDraggingAdditional(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset dragging state
    if (fileType === 'aadharCard') setIsDraggingAadhar(false);
    else if (fileType === 'photograph') setIsDraggingPhoto(false);
    else if (fileType === 'additionalDocument') setIsDraggingAdditional(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile, fileType);
    }
  };

  const handleFileSelection = (file, fileType) => {
    if (!validateFile(file, fileType)) {
      return;
    }
    
    // Update upload status to show progress
    setUploadStatus(prev => ({ ...prev, [fileType]: 'uploading' }));
    
    // Create a preview if it's an image
    let previewUrl = null;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }
    
    // Simulate upload progress
    simulateUpload(fileType);
    
    // Store file with preview
    // Don't modify the original file object, store preview separately
    setLocalData(prev => ({ 
      ...prev, 
      [`${fileType}Preview`]: previewUrl,
      [fileType]: file // Keep the original File object
    }));
  };

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0], fileType);
    }
  };
  
  const simulateUpload = (fileType) => {
    setUploadStatus(prev => ({ ...prev, [fileType]: 'uploading' }));
    
    // Simulate progress (in a real app, this would be an actual upload)
    setTimeout(() => {
      setUploadStatus(prev => ({ ...prev, [fileType]: 'success' }));
    }, 1500);
  };

  const removeFile = (fileType) => {
    // Clean up preview URL if it exists
    const previewUrl = localData[`${fileType}Preview`];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setLocalData(prev => ({ 
      ...prev, 
      [fileType]: null,
      [`${fileType}Preview`]: null
    }));
    setUploadStatus(prev => ({ ...prev, [fileType]: null }));
    setErrors(prev => ({ ...prev, [fileType]: null }));
  };
  
  const handleAdditionalTypeChange = (type) => {
    setLocalData(prev => ({ 
      ...prev, 
      additionalDocumentType: type,
      additionalDocument: null,
      additionalDocumentUrl: ''
    }));
    setUploadStatus(prev => ({ ...prev, additionalDocument: null }));
  };
  
  const handleUrlChange = (e) => {
    setLocalData(prev => ({ ...prev, additionalDocumentUrl: e.target.value }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check if required files are uploaded
    if (!localData.aadharCard) {
      newErrors.aadharCard = language === 'en' 
        ? 'Nominee\'s Aadhar Card is required' 
        : 'नामांकित व्यक्ति का आधार कार्ड आवश्यक है';
    }
    
    if (!localData.photograph) {
      newErrors.photograph = language === 'en' 
        ? 'Nominee\'s recent photograph is required' 
        : 'नामांकित व्यक्ति का हाल का फोटो आवश्यक है';
    }
    
    // If video URL is selected but no URL provided
    if (localData.additionalDocumentType === 'video_url' && !localData.additionalDocumentUrl) {
      newErrors.additionalDocumentUrl = language === 'en' 
        ? 'Please provide a video URL' 
        : 'कृपया एक वीडियो URL प्रदान करें';
    }
    
    // If video URL is provided but not a valid URL
    if (localData.additionalDocumentType === 'video_url' && 
        localData.additionalDocumentUrl && 
        !isValidUrl(localData.additionalDocumentUrl)) {
      newErrors.additionalDocumentUrl = language === 'en' 
        ? 'Please provide a valid URL' 
        : 'कृपया एक मान्य URL प्रदान करें';
    }
    
    // If file upload is selected but no file provided
    if (['news_clipping', 'recommendation_letter', 'video_file'].includes(localData.additionalDocumentType) && 
        !localData.additionalDocument) {
      newErrors.additionalDocument = language === 'en' 
        ? 'Please upload the selected document type' 
        : 'कृपया चयनित दस्तावेज़ प्रकार अपलोड करें';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    const validationPassed = validateForm();
    console.log('Form validation result:', validationPassed, 'Errors:', errors);
    
    if (!validationPassed) {
      return;
    }
    
    console.log('Documents to submit:', {
      aadharCard: localData.aadharCard ? localData.aadharCard.name : 'None',
      photograph: localData.photograph ? localData.photograph.name : 'None',
      additionalDocument: localData.additionalDocument ? localData.additionalDocument.name : 'None',
      additionalDocumentType: localData.additionalDocumentType,
      additionalDocumentUrl: localData.additionalDocumentUrl
    });
    
    onComplete({ 
      documents: {
        aadharCard: localData.aadharCard,
        photograph: localData.photograph,
        additionalDocument: localData.additionalDocument,
        additionalDocumentType: localData.additionalDocumentType,
        additionalDocumentUrl: localData.additionalDocumentUrl
      }
    });
  };

  const renderFilePreview = (fileType) => {
    const file = localData[fileType];
    const previewUrl = localData[`${fileType}Preview`];
    
    if (!file) return null;
    
    if (file.type && file.type.startsWith('image/')) {
      return (
        <div className="w-12 h-12 rounded-md bg-accent overflow-hidden flex items-center justify-center">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="object-cover w-full h-full"
          />
        </div>
      );
    } else if (file.type && file.type.startsWith('video/')) {
      return (
        <div className="w-12 h-12 rounded-md bg-accent flex items-center justify-center">
          <Icon name="Video" size={24} className="text-primary" />
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-md bg-accent flex items-center justify-center">
          <Icon name="File" size={24} className="text-primary" />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
          <TranslateText translationKey="uploadDocuments">Upload Required Documents</TranslateText>
        </h3>
        <p className="text-sm text-text-secondary">
          <TranslateText translationKey="requiredDocumentsDesc">
            Please upload the required documents for verification
          </TranslateText>
        </p>
      </div>

      {/* Required Documents Section */}
      <div className="bg-accent bg-opacity-10 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-primary mb-3">
          <TranslateText translationKey="requiredDocuments">Required Documents</TranslateText>
        </h4>

        {/* Aadhar Card Upload */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="CreditCard" size={16} className="inline mr-2" />
            <TranslateText translationKey="aadharCard">Nominee's Aadhar Card</TranslateText> *
          </label>

          {!localData.aadharCard ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDraggingAadhar ? 'border-primary bg-primary bg-opacity-5' : 'border-border hover:border-primary hover:bg-accent hover:bg-opacity-10'
              }`}
              onDragEnter={(e) => handleDragEnter(e, 'aadharCard')}
              onDragLeave={(e) => handleDragLeave(e, 'aadharCard')}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'aadharCard')}
              onClick={() => aadharCardRef.current.click()}
            >
              <input
                type="file"
                className="hidden"
                ref={aadharCardRef}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, 'aadharCard')}
              />
              
              <Icon name="Upload" size={24} className="mx-auto mb-2 text-text-secondary" />
              
              <p className="text-sm text-text-primary font-medium mb-1">
                <TranslateText translationKey="dragAndDrop">
                  Drag and drop or click to browse
                </TranslateText>
              </p>
              
              <p className="text-xs text-text-secondary">
                <TranslateText translationKey="supportedFormats">
                  Supports JPG, PNG, PDF (max 5MB)
                </TranslateText>
              </p>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {renderFilePreview('aadharCard')}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {localData.aadharCard.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {(localData.aadharCard.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {uploadStatus.aadharCard === 'uploading' ? (
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                  ) : uploadStatus.aadharCard === 'success' ? (
                    <Icon name="CheckCircle" size={18} className="text-success mr-2" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFile('aadharCard')}
                    className="text-text-secondary hover:text-error"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.aadharCard && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.aadharCard}
            </p>
          )}
        </div>

        {/* Nominee's Photograph */}
        <div>
          <label className="form-label">
            <Icon name="Image" size={16} className="inline mr-2" />
            <TranslateText translationKey="photograph">Nominee's Recent Photograph</TranslateText> *
          </label>

          {!localData.photograph ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDraggingPhoto ? 'border-primary bg-primary bg-opacity-5' : 'border-border hover:border-primary hover:bg-accent hover:bg-opacity-10'
              }`}
              onDragEnter={(e) => handleDragEnter(e, 'photograph')}
              onDragLeave={(e) => handleDragLeave(e, 'photograph')}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'photograph')}
              onClick={() => photographRef.current.click()}
            >
              <input
                type="file"
                className="hidden"
                ref={photographRef}
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'photograph')}
              />
              
              <Icon name="Image" size={24} className="mx-auto mb-2 text-text-secondary" />
              
              <p className="text-sm text-text-primary font-medium mb-1">
                <TranslateText translationKey="uploadPhoto">
                  Upload a clear photograph
                </TranslateText>
              </p>
              
              <p className="text-xs text-text-secondary">
                <TranslateText translationKey="photoFormats">
                  Supports JPG, PNG (max 5MB)
                </TranslateText>
              </p>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {renderFilePreview('photograph')}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {localData.photograph.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {(localData.photograph.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {uploadStatus.photograph === 'uploading' ? (
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                  ) : uploadStatus.photograph === 'success' ? (
                    <Icon name="CheckCircle" size={18} className="text-success mr-2" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFile('photograph')}
                    className="text-text-secondary hover:text-error"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.photograph && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.photograph}
            </p>
          )}
        </div>
      </div>

      {/* Optional Documents Section */}
      <div className="bg-accent bg-opacity-10 p-4 rounded-lg">
        <h4 className="font-medium text-primary mb-3">
          <TranslateText translationKey="optionalDocuments">Optional Documents (any one)</TranslateText>
        </h4>

        <div className="mb-4">
          <label className="form-label">
            <Icon name="File" size={16} className="inline mr-2" />
            <TranslateText translationKey="selectAdditionalDocument">Select Document Type</TranslateText>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleAdditionalTypeChange('news_clipping')}
              className={`p-3 border rounded-lg flex items-center space-x-3 text-left transition-colors ${
                localData.additionalDocumentType === 'news_clipping'
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <Icon name="Newspaper" size={20} className={`${localData.additionalDocumentType === 'news_clipping' ? 'text-primary' : 'text-text-secondary'}`} />
              <span className="text-sm font-medium text-text-primary">
                <TranslateText translationKey="newsClipping">News Clipping / Proof of Work</TranslateText>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAdditionalTypeChange('video_url')}
              className={`p-3 border rounded-lg flex items-center space-x-3 text-left transition-colors ${
                localData.additionalDocumentType === 'video_url'
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <Icon name="Video" size={20} className={`${localData.additionalDocumentType === 'video_url' ? 'text-primary' : 'text-text-secondary'}`} />
              <span className="text-sm font-medium text-text-primary">
                <TranslateText translationKey="videoUrl">Video Testimony (URL)</TranslateText>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAdditionalTypeChange('video_file')}
              className={`p-3 border rounded-lg flex items-center space-x-3 text-left transition-colors ${
                localData.additionalDocumentType === 'video_file'
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <Icon name="Film" size={20} className={`${localData.additionalDocumentType === 'video_file' ? 'text-primary' : 'text-text-secondary'}`} />
              <span className="text-sm font-medium text-text-primary">
                <TranslateText translationKey="videoFile">Video Testimony (Upload)</TranslateText>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAdditionalTypeChange('recommendation_letter')}
              className={`p-3 border rounded-lg flex items-center space-x-3 text-left transition-colors ${
                localData.additionalDocumentType === 'recommendation_letter'
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <Icon name="FileText" size={20} className={`${localData.additionalDocumentType === 'recommendation_letter' ? 'text-primary' : 'text-text-secondary'}`} />
              <span className="text-sm font-medium text-text-primary">
                <TranslateText translationKey="recommendationLetter">Recommendation Letter</TranslateText>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAdditionalTypeChange('none')}
              className={`p-3 border rounded-lg flex items-center space-x-3 text-left transition-colors ${
                localData.additionalDocumentType === 'none'
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <Icon name="XCircle" size={20} className={`${localData.additionalDocumentType === 'none' ? 'text-primary' : 'text-text-secondary'}`} />
              <span className="text-sm font-medium text-text-primary">
                <TranslateText translationKey="noAdditionalDocument">None</TranslateText>
              </span>
            </button>
          </div>

          {/* Video URL Input */}
          {localData.additionalDocumentType === 'video_url' && (
            <div className="mb-4">
              <label className="form-label">
                <Icon name="Link" size={16} className="inline mr-2" />
                <TranslateText translationKey="videoUrl">Video URL</TranslateText>
              </label>
              <input
                type="url"
                value={localData.additionalDocumentUrl}
                onChange={handleUrlChange}
                className={`form-input ${errors.additionalDocumentUrl ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder={language === 'en' ? 'Enter YouTube or Vimeo URL' : 'YouTube या Vimeo URL दर्ज करें'}
                disabled={isLoading}
              />
              {errors.additionalDocumentUrl && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.additionalDocumentUrl}
                </p>
              )}
            </div>
          )}

          {/* File Upload UI for selected document type */}
          {['news_clipping', 'recommendation_letter', 'video_file'].includes(localData.additionalDocumentType) && (
            <div>
              {!localData.additionalDocument ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDraggingAdditional ? 'border-primary bg-primary bg-opacity-5' : 'border-border hover:border-primary hover:bg-accent hover:bg-opacity-10'
                  }`}
                  onDragEnter={(e) => handleDragEnter(e, 'additionalDocument')}
                  onDragLeave={(e) => handleDragLeave(e, 'additionalDocument')}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'additionalDocument')}
                  onClick={() => additionalDocRef.current.click()}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={additionalDocRef}
                    accept={
                      localData.additionalDocumentType === 'video_file'
                        ? '.mp4,.mov,.avi'
                        : '.jpg,.jpeg,.png,.pdf'
                    }
                    onChange={(e) => handleFileChange(e, 'additionalDocument')}
                  />
                  
                  <Icon 
                    name={
                      localData.additionalDocumentType === 'video_file' 
                        ? 'Video' 
                        : localData.additionalDocumentType === 'news_clipping'
                        ? 'Newspaper'
                        : 'FileText'
                    } 
                    size={24} 
                    className="mx-auto mb-2 text-text-secondary" 
                  />
                  
                  <p className="text-sm text-text-primary font-medium mb-1">
                    <TranslateText translationKey="dragAndDrop">
                      Drag and drop or click to browse
                    </TranslateText>
                  </p>
                  
                  <p className="text-xs text-text-secondary">
                    {localData.additionalDocumentType === 'video_file' ? (
                      <TranslateText translationKey="videoFormats">
                        Supports MP4, MOV, AVI (max 5MB)
                      </TranslateText>
                    ) : (
                      <TranslateText translationKey="supportedFormats">
                        Supports JPG, PNG, PDF (max 5MB)
                      </TranslateText>
                    )}
                  </p>
                </div>
              ) : (
                <div className="bg-background border border-border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {renderFilePreview('additionalDocument')}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {localData.additionalDocument.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {(localData.additionalDocument.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                    <div className="flex items-center">
                      {uploadStatus.additionalDocument === 'uploading' ? (
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                      ) : uploadStatus.additionalDocument === 'success' ? (
                        <Icon name="CheckCircle" size={18} className="text-success mr-2" />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeFile('additionalDocument')}
                        className="text-text-secondary hover:text-error"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errors.additionalDocument && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.additionalDocument}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between space-y-4 space-y-reverse sm:space-y-0">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="btn-outline w-full sm:w-auto"
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          <TranslateText translationKey="back">Back</TranslateText>
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-primary w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span><TranslateText translationKey="processing">Processing...</TranslateText></span>
            </>
          ) : (
            <>
              <span><TranslateText translationKey="submitNomination">Submit Nomination</TranslateText></span>
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload; 