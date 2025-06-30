import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

const RegistrationForm = ({ formData, errors, onComplete, setErrors, isLoading }) => {
  const { language } = useLanguage();
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    village: formData.village || '',
    city: formData.city || '',
    phoneNumber: formData.phoneNumber || '',
    termsAccepted: formData.termsAccepted || false,
    details: formData.details || ""
  });  

  const validateForm = () => {
    const newErrors = {};

    if (!localData.name.trim()) {
      newErrors.name = language === 'en' ? 'Name is required' : 'नाम आवश्यक है';
    } else if (localData.name.trim().length < 2) {
      newErrors.name = language === 'en' ? 'Name must be at least 2 characters' : 'नाम कम से कम 2 अक्षर का होना चाहिए';
    }

    if (!localData.village.trim()) {
      newErrors.village = language === 'en' ? 'Village name is required' : 'गाँव का नाम आवश्यक है';
    }

    if (!localData.city.trim()) {
      newErrors.city = language === 'en' ? 'City name is required' : 'शहर का नाम आवश्यक है';
    }

    if (!localData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'फोन नंबर आवश्यक है';
    } else if (!/^[6-9]\d{9}$/.test(localData.phoneNumber)) {
      newErrors.phoneNumber = language === 'en' ? 'Please enter a valid 10-digit Indian mobile number' : 'कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें';
    }

    if (!localData.termsAccepted) {
      newErrors.termsAccepted = language === 'en' ? 'You must accept the terms and conditions' : 'आपको नियम और शर्तों को स्वीकार करना होगा';
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

    onComplete(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="form-label">
          <Icon name="User" size={16} className="inline mr-2" />
          <TranslateText translationKey="fullName">Full Name</TranslateText> *
        </label>
        <input
          type="text"
          value={localData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`form-input ${errors.name ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Village Field */}
      <div>
        <label className="form-label">
          <Icon name="MapPin" size={16} className="inline mr-2" />
          <TranslateText translationKey="village">Village</TranslateText> *
        </label>
        <input
          type="text"
          value={localData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
          className={`form-input ${errors.village ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Enter your village name' : 'अपने गाँव का नाम दर्ज करें'}
          disabled={isLoading}
        />
        {errors.village && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.village}
          </p>
        )}
      </div>

      {/* City Field */}
      <div>
        <label className="form-label">
          <Icon name="MapPin" size={16} className="inline mr-2" />
          <TranslateText translationKey="city">City</TranslateText> *
        </label>
        <input
          type="text"
          value={localData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className={`form-input ${errors.city ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Enter your city name' : 'अपने शहर का नाम दर्ज करें'}
          disabled={isLoading}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.city}
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div>
        <label className="form-label">
          <Icon name="Phone" size={16} className="inline mr-2" />
          <TranslateText translationKey="mobileNumber">Mobile Number</TranslateText> *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-text-secondary text-sm">+91</span>
          </div>
          <input
            type="tel"
            value={localData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={`form-input pl-12 ${errors.phoneNumber ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Enter 10-digit mobile number' : '10 अंकों का मोबाइल नंबर दर्ज करें'}
            disabled={isLoading}
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.phoneNumber}
          </p>
        )}
      </div>

      {/* Details Field */}
      <div>
        <label className="form-label">
          <TranslateText translationKey="problemDetails">Problem Details</TranslateText> *
        </label>
        <div className="relative">
          <textarea
            value={localData.details}
            onChange={(e) => handleInputChange('details', e.target.value)}
            className={`form-input ${errors.details ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Describe your problem' : 'अपनी समस्या का वर्णन करें'}
            disabled={isLoading}
          />
        </div>
        {errors.details && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.details}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.termsAccepted}
            onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
            disabled={isLoading}
          />
          <span className="text-sm text-text-secondary leading-relaxed">
            <TranslateText translationKey="agreeToTerms">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Terms and Conditions
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>{' '}
              of Rashtriya Kisan Manch
            </TranslateText>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span><TranslateText translationKey="processing">Processing...</TranslateText></span>
            </>
          ) : (
            <>
              <Icon name="ArrowRight" size={20} />
              <span><TranslateText translationKey="continueToVerification">Continue to Verification</TranslateText></span>
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          <TranslateText translationKey="needHelp">
            Need help? Contact us at{' '}
            <a href="tel:+917860411111" className="text-primary hover:underline">
              +917860411111
            </a>
          </TranslateText>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;