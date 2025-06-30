import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';

const BackgroundInfoForm = ({ formData, errors, onComplete, onBack, setErrors }) => {
  const [localData, setLocalData] = useState({
    age: formData.age || '',
    education: formData.education || '',
    experience: formData.experience || '',
    motivation: formData.motivation || '',
    leadership: formData.leadership || '',
    documents: formData.documents || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!localData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(localData.age);
      if (isNaN(age) || age < 18 || age > 35) {
        newErrors.age = 'Age must be between 18 and 35';
      }
    }

    if (!localData.education.trim()) {
      newErrors.education = 'Educational background is required';
    }

    if (!localData.experience.trim()) {
      newErrors.experience = 'Agricultural experience is required';
    } else if (localData.experience.trim().length < 50) {
      newErrors.experience = 'Please provide more details about your experience (minimum 50 characters)';
    }

    if (!localData.motivation.trim()) {
      newErrors.motivation = 'Motivation statement is required';
    } else if (localData.motivation.trim().length < 100) {
      newErrors.motivation = 'Please elaborate on your motivation (minimum 100 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onComplete(localData);
  };

  // Document upload functionality
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }));
      
      setLocalData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeDocument = (id) => {
    setLocalData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Field */}
        <div>
          <label className="form-label">
            <Icon name="Calendar" size={16} className="inline mr-2" />
            Age *
          </label>
          <input
            type="number"
            value={localData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className={`form-input ${errors.age ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder="Enter your age (18-35)"
            min="18"
            max="35"
            disabled={isSubmitting}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.age}
            </p>
          )}
        </div>

        {/* Education Field */}
        <div>
          <label className="form-label">
            <Icon name="GraduationCap" size={16} className="inline mr-2" />
            Educational Background *
          </label>
          <input
            type="text"
            value={localData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className={`form-input ${errors.education ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder="e.g., 12th Pass, Graduate, etc."
            disabled={isSubmitting}
          />
          {errors.education && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.education}
            </p>
          )}
        </div>
      </div>

      {/* Agricultural Experience Field */}
      <div>
        <label className="form-label">
          <Icon name="Sprout" size={16} className="inline mr-2" />
          Agricultural Experience *
        </label>
        <textarea
          value={localData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className={`form-input min-h-[100px] resize-none ${errors.experience ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Describe your farming or agricultural experience"
          rows={3}
          disabled={isSubmitting}
        />
        {errors.experience ? (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.experience}
          </p>
        ) : (
          <p className="mt-1 text-xs text-text-secondary">
            Describe any experience you have with farming, gardening, or agricultural activities
          </p>
        )}
      </div>

      {/* Motivation Statement Field */}
      <div>
        <label className="form-label">
          <Icon name="Target" size={16} className="inline mr-2" />
          Motivation Statement *
        </label>
        <textarea
          value={localData.motivation}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          className={`form-input min-h-[120px] resize-none ${errors.motivation ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Why are you interested in the Youth Leadership Program?"
          rows={4}
          disabled={isSubmitting}
        />
        {errors.motivation ? (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.motivation}
          </p>
        ) : (
          <p className="mt-1 text-xs text-text-secondary">
            Explain why you want to join the program and what you hope to achieve
          </p>
        )}
      </div>

      {/* Leadership Experience Field */}
      <div>
        <label className="form-label">
          <Icon name="Users" size={16} className="inline mr-2" />
          Leadership Experience (Optional)
        </label>
        <textarea
          value={localData.leadership}
          onChange={(e) => handleInputChange('leadership', e.target.value)}
          className="form-input min-h-[100px] resize-none"
          placeholder="Describe any leadership roles or community activities you've participated in"
          rows={3}
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-text-secondary">
          This could include school clubs, community service, village committees, etc.
        </p>
      </div>

      {/* Document Upload */}
      <div>
        <label className="form-label">
          <Icon name="FileText" size={16} className="inline mr-2" />
          Supporting Documents (Optional)
        </label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-smooth cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <div className="flex flex-col items-center py-4">
            <Icon name="Upload" size={24} className="text-text-secondary mb-3" />
            <p className="text-text-primary font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-text-secondary">PDF, DOC, JPG, PNG (max 5MB each)</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          You can upload certificates, recommendation letters, or any relevant documents
        </p>

        {/* Uploaded Documents */}
        {localData.documents.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-text-primary">Uploaded Documents</h4>
            {localData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 bg-background rounded-md">
                <div className="flex items-center">
                  <Icon 
                    name={doc.type.includes('pdf') ? 'FileText' : doc.type.includes('image') ? 'Image' : 'File'} 
                    size={16} 
                    className="text-primary mr-2" 
                  />
                  <div className="text-sm truncate max-w-xs">
                    <p className="font-medium text-text-primary truncate">{doc.name}</p>
                    <p className="text-xs text-text-secondary">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeDocument(doc.id)}
                  className="text-text-secondary hover:text-error transition-smooth"
                  disabled={isSubmitting}
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Expectations */}
      <div className="bg-accent bg-opacity-20 p-4 rounded-lg">
        <h3 className="font-medium text-primary mb-2">Program Expectations</h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li className="flex items-start">
            <Icon name="Clock" size={14} className="mr-2 mt-1 text-secondary" />
            <span>Commitment of 10-15 hours per month for 6 months</span>
          </li>
          <li className="flex items-start">
            <Icon name="MapPin" size={14} className="mr-2 mt-1 text-secondary" />
            <span>Attendance at monthly in-person workshops at regional centers</span>
          </li>
          <li className="flex items-start">
            <Icon name="Laptop" size={14} className="mr-2 mt-1 text-secondary" />
            <span>Participation in online learning modules and group discussions</span>
          </li>
          <li className="flex items-start">
            <Icon name="FileText" size={14} className="mr-2 mt-1 text-secondary" />
            <span>Completion of a community project by the end of the program</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 btn-outline flex items-center justify-center space-x-2"
          disabled={isSubmitting}
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Icon name="CheckCircle" size={20} />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">
          Need help with your application? Email us at{' '}
          <a href="mailto:youth@kisanandolan.org" className="text-primary hover:underline">
            youth@kisanandolan.org
          </a>
        </p>
      </div>
    </form>
  );
};

export default BackgroundInfoForm;