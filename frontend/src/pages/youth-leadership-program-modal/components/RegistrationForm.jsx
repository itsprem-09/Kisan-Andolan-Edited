import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

const RegistrationForm = ({ formData, errors, onComplete, setErrors, isLoading }) => {
  const { language } = useLanguage();
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    village: formData.village || '',
    phoneNumber: formData.phoneNumber || '',
    age: formData.age || '',
    education: formData.education || '',
    experience: formData.experience || '',
    termsAccepted: formData.termsAccepted || false
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

    if (!localData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'फोन नंबर आवश्यक है';
    } else if (!/^[6-9]\d{9}$/.test(localData.phoneNumber)) {
      newErrors.phoneNumber = language === 'en' ? 'Please enter a valid 10-digit Indian mobile number' : 'कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें';
    }

    if (!localData.age.trim()) {
      newErrors.age = language === 'en' ? 'Age is required' : 'आयु आवश्यक है';
    } else if (parseInt(localData.age) < 18 || parseInt(localData.age) > 35) {
      newErrors.age = language === 'en' ? 'Age must be between 18 and 35 years' : 'आयु 18 और 35 वर्ष के बीच होनी चाहिए';
    }

    if (!localData.education.trim()) {
      newErrors.education = language === 'en' ? 'Education information is required' : 'शिक्षा की जानकारी आवश्यक है';
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
          <TranslateText translationKey="village">Village</TranslateText>/<TranslateText translationKey="city">City</TranslateText> *
        </label>
        <input
          type="text"
          value={localData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
          className={`form-input ${errors.village ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Enter your village or city name' : 'अपने गाँव या शहर का नाम दर्ज करें'}
          disabled={isLoading}
        />
        {errors.village && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.village}
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
        <p className="mt-1 text-xs text-text-secondary">
          <TranslateText dynamic={false}>
            We'll send an OTP to verify your mobile number
          </TranslateText>
        </p>
      </div>
      
      {/* Age Field */}
      <div>
        <label className="form-label">
          <Icon name="Calendar" size={16} className="inline mr-2" />
          <TranslateText translationKey="age">Age</TranslateText> *
        </label>
        <input
          type="number"
          min="18"
          max="35"
          value={localData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className={`form-input ${errors.age ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Age (18-35)' : 'आयु (18-35)'}
          disabled={isLoading}
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
          <Icon name="BookOpen" size={16} className="inline mr-2" />
          <TranslateText translationKey="education">Education</TranslateText> *
        </label>
        <input
          type="text"
          value={localData.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className={`form-input ${errors.education ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Highest educational qualification' : 'उच्चतम शैक्षिक योग्यता'}
          disabled={isLoading}
        />
        {errors.education && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.education}
          </p>
        )}
      </div>

      {/* Experience Field */}
      <div>
        <label className="form-label">
          <Icon name="Briefcase" size={16} className="inline mr-2" />
          <TranslateText translationKey="farmingExperience">Agriculture Experience</TranslateText>
        </label>
        <textarea
          value={localData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className={`form-input ${errors.experience ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder={language === 'en' ? 'Describe your experience in agriculture (if any)' : 'कृषि में अपने अनुभव का वर्णन करें (यदि कोई हो)'}
          rows={3}
          disabled={isLoading}
        />
        {errors.experience && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.experience}
          </p>
        )}
      </div>

      {/* Program Information */}
      <div className="bg-accent bg-opacity-20 p-4 rounded-lg">
        <h3 className="font-medium text-primary mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          <TranslateText translationKey="kisanLeadershipProgram">Youth Leadership Program Details</TranslateText>
        </h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>
              <TranslateText dynamic={false}>
                Open to youth aged 18-35 interested in agricultural leadership
              </TranslateText>
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>
              <TranslateText dynamic={false}>
                6-month program with monthly workshops and mentorship
              </TranslateText>
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>
              <TranslateText dynamic={false}>
                Covers agricultural innovation, community organizing, and entrepreneurship
              </TranslateText>
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>
              <TranslateText dynamic={false}>
                Selected participants receive full scholarship and stipend
              </TranslateText>
            </span>
          </li>
        </ul>
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