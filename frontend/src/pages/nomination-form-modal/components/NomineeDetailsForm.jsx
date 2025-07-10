import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

// Sample data for dropdown
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const NomineeDetailsForm = ({ formData, errors, onComplete, setErrors, isLoading }) => {
  const { language } = useLanguage();
  const [localData, setLocalData] = useState({
    nomineeName: formData.nomineeName || '',
    nomineeAge: formData.nomineeAge || '',
    nomineeGender: formData.nomineeGender || '',
    state: formData.state || '',
    district: formData.district || '',
    occupation: formData.occupation || '',
    contribution: formData.contribution || '',
    nominatorName: formData.nominatorName || '',
    nominatorMobile: formData.nominatorMobile || '',
    nominatorEmail: formData.nominatorEmail || '',
    termsAccepted: formData.termsAccepted || false
  });

  const [occupationOther, setOccupationOther] = useState(
    formData.occupation && !['Farmer', 'Rural Educator', 'Social Worker'].includes(formData.occupation)
      ? formData.occupation
      : ''
  );

  const validateForm = () => {
    const newErrors = {};

    if (!localData.nomineeName.trim()) {
      newErrors.nomineeName = language === 'en' ? 'Nominee name is required' : 'नामांकित व्यक्ति का नाम आवश्यक है';
    } else if (localData.nomineeName.trim().length < 2) {
      newErrors.nomineeName = language === 'en' ? 'Name must be at least 2 characters' : 'नाम कम से कम 2 अक्षर का होना चाहिए';
    }

    if (localData.nomineeAge && (isNaN(localData.nomineeAge) || localData.nomineeAge < 18 || localData.nomineeAge > 120)) {
      newErrors.nomineeAge = language === 'en' ? 'Please enter a valid age between 18 and 120' : 'कृपया 18 और 120 के बीच एक वैध उम्र दर्ज करें';
    }

    if (!localData.state) {
      newErrors.state = language === 'en' ? 'State is required' : 'राज्य आवश्यक है';
    }

    if (!localData.district) {
      newErrors.district = language === 'en' ? 'District is required' : 'जिला आवश्यक है';
    }

    if (!localData.occupation) {
      newErrors.occupation = language === 'en' ? 'Occupation is required' : 'व्यवसाय आवश्यक है';
    }

    if (localData.occupation === 'Other' && !occupationOther.trim()) {
      newErrors.occupationOther = language === 'en' ? 'Please specify the occupation' : 'कृपया व्यवसाय निर्दिष्ट करें';
    }

    if (localData.contribution && localData.contribution.length > 500) {
      newErrors.contribution = language === 'en' 
        ? `Description is too long (${localData.contribution.length}/500 characters)` 
        : `विवरण बहुत लंबा है (${localData.contribution.length}/500 अक्षर)`;
    }

    if (!localData.nominatorName.trim()) {
      newErrors.nominatorName = language === 'en' ? 'Your name is required' : 'आपका नाम आवश्यक है';
    }

    if (!localData.nominatorMobile.trim()) {
      newErrors.nominatorMobile = language === 'en' ? 'Mobile number is required' : 'मोबाइल नंबर आवश्यक है';
    } else if (!/^[6-9]\d{9}$/.test(localData.nominatorMobile)) {
      newErrors.nominatorMobile = language === 'en' ? 'Please enter a valid 10-digit Indian mobile number' : 'कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें';
    }

    if (localData.nominatorEmail && !/\S+@\S+\.\S+/.test(localData.nominatorEmail)) {
      newErrors.nominatorEmail = language === 'en' ? 'Please enter a valid email address' : 'कृपया एक वैध ईमेल पता दर्ज करें';
    }

    if (!localData.termsAccepted) {
      newErrors.termsAccepted = language === 'en' ? 'You must accept the terms and conditions' : 'आपको नियम और शर्तों को स्वीकार करना होगा';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));

    // Handle special case for occupation
    if (field === 'occupation' && value !== 'Other') {
      setOccupationOther('');
    }

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

    // If occupation is "Other", use the specified value
    const finalData = { ...localData };
    if (finalData.occupation === 'Other' && occupationOther) {
      finalData.occupation = occupationOther;
    }

    onComplete(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-accent bg-opacity-10 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-primary mb-2">
          <TranslateText translationKey="nomineeInformation">Nominee Information</TranslateText>
        </h3>
        
        {/* Nominee Full Name */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="User" size={16} className="inline mr-2" />
            <TranslateText translationKey="nomineeName">Full Name</TranslateText> *
          </label>
          <input
            type="text"
            value={localData.nomineeName}
            onChange={(e) => handleInputChange('nomineeName', e.target.value)}
            className={`form-input ${errors.nomineeName ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Enter nominee\'s full name' : 'नामांकित व्यक्ति का पूरा नाम दर्ज करें'}
            disabled={isLoading}
          />
          {errors.nomineeName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.nomineeName}
            </p>
          )}
        </div>

        {/* Nominee Age */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="Calendar" size={16} className="inline mr-2" />
            <TranslateText translationKey="age">Age</TranslateText>
          </label>
          <input
            type="number"
            value={localData.nomineeAge}
            onChange={(e) => handleInputChange('nomineeAge', e.target.value)}
            className={`form-input ${errors.nomineeAge ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Enter age' : 'उम्र दर्ज करें'}
            min="18"
            max="120"
            disabled={isLoading}
          />
          {errors.nomineeAge && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.nomineeAge}
            </p>
          )}
        </div>

        {/* Nominee Gender */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="Users" size={16} className="inline mr-2" />
            <TranslateText translationKey="gender">Gender</TranslateText>
          </label>
          <div className="flex space-x-4 mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Male"
                checked={localData.nomineeGender === 'Male'}
                onChange={() => handleInputChange('nomineeGender', 'Male')}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-text-primary">
                <TranslateText translationKey="male">Male</TranslateText>
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Female"
                checked={localData.nomineeGender === 'Female'}
                onChange={() => handleInputChange('nomineeGender', 'Female')}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-text-primary">
                <TranslateText translationKey="female">Female</TranslateText>
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Other"
                checked={localData.nomineeGender === 'Other'}
                onChange={() => handleInputChange('nomineeGender', 'Other')}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-text-primary">
                <TranslateText translationKey="other">Other</TranslateText>
              </span>
            </label>
          </div>
        </div>

        {/* State and District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">
              <Icon name="MapPin" size={16} className="inline mr-2" />
              <TranslateText translationKey="state">State</TranslateText> *
            </label>
            <select
              value={localData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`form-input ${errors.state ? 'border-error focus:border-error focus:ring-error' : ''}`}
              disabled={isLoading}
            >
              <option value="">
                {language === 'en' ? '-- Select State --' : '-- राज्य चुनें --'}
              </option>
              {INDIA_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.state}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">
              <Icon name="MapPin" size={16} className="inline mr-2" />
              <TranslateText translationKey="district">District</TranslateText> *
            </label>
            <input
              type="text"
              value={localData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className={`form-input ${errors.district ? 'border-error focus:border-error focus:ring-error' : ''}`}
              placeholder={language === 'en' ? 'Enter district name' : 'जिले का नाम दर्ज करें'}
              disabled={isLoading}
            />
            {errors.district && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.district}
              </p>
            )}
          </div>
        </div>

        {/* Occupation */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="Briefcase" size={16} className="inline mr-2" />
            <TranslateText translationKey="occupation">Occupation</TranslateText> *
          </label>
          <select
            value={localData.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className={`form-input ${errors.occupation ? 'border-error focus:border-error focus:ring-error' : ''}`}
            disabled={isLoading}
          >
            <option value="">
              {language === 'en' ? '-- Select Occupation --' : '-- व्यवसाय चुनें --'}
            </option>
            <option value="Farmer">
              {language === 'en' ? 'Farmer' : 'किसान'}
            </option>
            <option value="Rural Educator">
              {language === 'en' ? 'Rural Educator' : 'ग्रामीण शिक्षक'}
            </option>
            <option value="Social Worker">
              {language === 'en' ? 'Social Worker' : 'समाज सेवक'}
            </option>
            <option value="Other">
              {language === 'en' ? 'Other (specify)' : 'अन्य (निर्दिष्ट करें)'}
            </option>
          </select>
          {errors.occupation && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.occupation}
            </p>
          )}

          {/* Other occupation field */}
          {localData.occupation === 'Other' && (
            <div className="mt-2">
              <input
                type="text"
                value={occupationOther}
                onChange={(e) => setOccupationOther(e.target.value)}
                className={`form-input ${errors.occupationOther ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder={language === 'en' ? 'Please specify occupation' : 'कृपया व्यवसाय निर्दिष्ट करें'}
                disabled={isLoading}
              />
              {errors.occupationOther && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.occupationOther}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contribution */}
        <div>
          <label className="form-label">
            <Icon name="FileText" size={16} className="inline mr-2" />
            <TranslateText translationKey="contribution">
              Short Description of Nominee's Contribution
            </TranslateText>
          </label>
          <textarea
            value={localData.contribution}
            onChange={(e) => handleInputChange('contribution', e.target.value)}
            rows={3}
            maxLength={500}
            className={`form-input ${errors.contribution ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' 
              ? 'Describe the nominee\'s contribution in rural development (max 500 characters)' 
              : 'ग्रामीण विकास में नामांकित व्यक्ति के योगदान का वर्णन करें (अधिकतम 500 अक्षर)'}
            disabled={isLoading}
          ></textarea>
          <div className="flex justify-between mt-1 text-xs text-text-secondary">
            <span>
              {errors.contribution ? (
                <p className="text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.contribution}
                </p>
              ) : null}
            </span>
            <span>{localData.contribution.length}/500</span>
          </div>
        </div>
      </div>

      <div className="bg-accent bg-opacity-10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-primary mb-2">
          <TranslateText translationKey="nominatorInformation">Nominator Information</TranslateText>
        </h3>
        
        {/* Nominator Full Name */}
        <div className="mb-4">
          <label className="form-label">
            <Icon name="User" size={16} className="inline mr-2" />
            <TranslateText translationKey="yourName">Your Full Name</TranslateText> *
          </label>
          <input
            type="text"
            value={localData.nominatorName}
            onChange={(e) => handleInputChange('nominatorName', e.target.value)}
            className={`form-input ${errors.nominatorName ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
            disabled={isLoading}
          />
          {errors.nominatorName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.nominatorName}
            </p>
          )}
        </div>

        {/* Nominator Mobile Number */}
        <div className="mb-4">
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
              value={localData.nominatorMobile}
              onChange={(e) => handleInputChange('nominatorMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`form-input pl-12 ${errors.nominatorMobile ? 'border-error focus:border-error focus:ring-error' : ''}`}
              placeholder={language === 'en' ? 'Enter 10-digit mobile number' : '10 अंकों का मोबाइल नंबर दर्ज करें'}
              disabled={isLoading}
            />
          </div>
          {errors.nominatorMobile && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.nominatorMobile}
            </p>
          )}
        </div>

        {/* Nominator Email */}
        <div>
          <label className="form-label">
            <Icon name="Mail" size={16} className="inline mr-2" />
            <TranslateText translationKey="email">Email Address</TranslateText> (optional)
          </label>
          <input
            type="email"
            value={localData.nominatorEmail}
            onChange={(e) => handleInputChange('nominatorEmail', e.target.value)}
            className={`form-input ${errors.nominatorEmail ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder={language === 'en' ? 'Enter your email address' : 'अपना ईमेल पता दर्ज करें'}
            disabled={isLoading}
          />
          {errors.nominatorEmail && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.nominatorEmail}
            </p>
          )}
        </div>
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
              I confirm that the information provided is accurate to the best of my knowledge and I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Terms and Conditions
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>
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

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary py-3 px-6 min-w-[150px] flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <TranslateText translationKey="next">Next</TranslateText>
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NomineeDetailsForm; 