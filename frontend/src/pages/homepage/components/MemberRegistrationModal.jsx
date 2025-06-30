import React, { useState } from 'react';
import Modal from 'components/ui/Modal';
import Icon from 'components/AppIcon';

const MemberRegistrationModal = ({ isOpen, onClose, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    phoneNumber: '',
    document: null
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock credentials for demonstration
  const mockCredentials = {
    phoneNumber: '9876543210',
    otp: '123456'
  };

  const content = {
    en: {
      title: "Become a Member",
      steps: {
        1: "Personal Information",
        2: "Phone Verification",
        3: "Document Upload (Optional)",
        4: "Registration Complete"
      },
      form: {
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        village: "Village/City",
        villagePlaceholder: "Enter your village or city",
        phoneNumber: "Phone Number",
        phonePlaceholder: "Enter your 10-digit phone number",
        document: "Upload Document (Optional)",
        documentHelp: "Upload Aadhaar or PAN card for verification",
        otp: "Enter OTP",
        otpPlaceholder: "Enter 6-digit OTP",
        otpSent: "OTP sent to your phone number",
        resendOtp: "Resend OTP"
      },
      buttons: {
        next: "Next",
        verify: "Verify OTP",
        submit: "Complete Registration",
        close: "Close"
      },
      success: {
        title: "Registration Successful!",
        message: "Welcome to Kisan Andolan! You will receive a confirmation message shortly.",
        membershipId: "Your Membership ID: KA2024"
      },
      errors: {
        nameRequired: "Name is required",
        villageRequired: "Village/City is required",
        phoneRequired: "Phone number is required",
        phoneInvalid: "Please enter a valid 10-digit phone number",
        phoneWrong: "Please use phone number: 9876543210 for demo",
        otpRequired: "OTP is required",
        otpInvalid: "Please enter a valid 6-digit OTP",
        otpWrong: "Invalid OTP. Please use: 123456 for demo"
      }
    },
    hi: {
      title: "सदस्य बनें",
      steps: {
        1: "व्यक्तिगत जानकारी",
        2: "फोन सत्यापन",
        3: "दस्तावेज़ अपलोड (वैकल्पिक)",
        4: "पंजीकरण पूर्ण"
      },
      form: {
        name: "पूरा नाम",
        namePlaceholder: "अपना पूरा नाम दर्ज करें",
        village: "गांव/शहर",
        villagePlaceholder: "अपना गांव या शहर दर्ज करें",
        phoneNumber: "फोन नंबर",
        phonePlaceholder: "अपना 10-अंकीय फोन नंबर दर्ज करें",
        document: "दस्तावेज़ अपलोड करें (वैकल्पिक)",
        documentHelp: "सत्यापन के लिए आधार या पैन कार्ड अपलोड करें",
        otp: "OTP दर्ज करें",
        otpPlaceholder: "6-अंकीय OTP दर्ज करें",
        otpSent: "आपके फोन नंबर पर OTP भेजा गया",
        resendOtp: "OTP फिर से भेजें"
      },
      buttons: {
        next: "आगे",
        verify: "OTP सत्यापित करें",
        submit: "पंजीकरण पूरा करें",
        close: "बंद करें"
      },
      success: {
        title: "पंजीकरण सफल!",
        message: "किसान आंदोलन में आपका स्वागत है! आपको शीघ्र ही एक पुष्टिकरण संदेश प्राप्त होगा।",
        membershipId: "आपकी सदस्यता ID: KA2024"
      },
      errors: {
        nameRequired: "नाम आवश्यक है",
        villageRequired: "गांव/शहर आवश्यक है",
        phoneRequired: "फोन नंबर आवश्यक है",
        phoneInvalid: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें",
        phoneWrong: "डेमो के लिए कृपया फोन नंबर: 9876543210 का उपयोग करें",
        otpRequired: "OTP आवश्यक है",
        otpInvalid: "कृपया एक वैध 6-अंकीय OTP दर्ज करें",
        otpWrong: "अमान्य OTP। डेमो के लिए कृपया: 123456 का उपयोग करें"
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = content[language].errors.nameRequired;
    }
    
    if (!formData.village.trim()) {
      newErrors.village = content[language].errors.villageRequired;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = content[language].errors.phoneRequired;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = content[language].errors.phoneInvalid;
    } else if (formData.phoneNumber !== mockCredentials.phoneNumber) {
      newErrors.phoneNumber = content[language].errors.phoneWrong;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!otp.trim()) {
      newErrors.otp = content[language].errors.otpRequired;
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = content[language].errors.otpInvalid;
    } else if (otp !== mockCredentials.otp) {
      newErrors.otp = content[language].errors.otpWrong;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleVerifyOtp = () => {
    if (validateOtp()) {
      setCurrentStep(3);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, document: file });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(4);
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', village: '', phoneNumber: '', document: null });
    setCurrentStep(1);
    setOtp('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">
          {content[language].form.name} *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder={content[language].form.namePlaceholder}
          className={`form-input ${errors.name ? 'border-error' : ''}`}
        />
        {errors.name && (
          <p className="text-error text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="form-label">
          {content[language].form.village} *
        </label>
        <input
          type="text"
          value={formData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
          placeholder={content[language].form.villagePlaceholder}
          className={`form-input ${errors.village ? 'border-error' : ''}`}
        />
        {errors.village && (
          <p className="text-error text-sm mt-1">{errors.village}</p>
        )}
      </div>

      <div>
        <label className="form-label">
          {content[language].form.phoneNumber} *
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          placeholder={content[language].form.phonePlaceholder}
          className={`form-input ${errors.phoneNumber ? 'border-error' : ''}`}
          maxLength={10}
        />
        {errors.phoneNumber && (
          <p className="text-error text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <button onClick={handleNext} className="btn-primary w-full">
        {content[language].buttons.next}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Smartphone" size={32} color="#4a7c59" />
        </div>
        <p className="text-text-secondary">
          {content[language].form.otpSent}
        </p>
        <p className="text-sm font-medium text-primary">
          +91 {formData.phoneNumber}
        </p>
      </div>

      <div>
        <label className="form-label">
          {content[language].form.otp} *
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={content[language].form.otpPlaceholder}
          className={`form-input text-center text-lg tracking-widest ${errors.otp ? 'border-error' : ''}`}
          maxLength={6}
        />
        {errors.otp && (
          <p className="text-error text-sm mt-1">{errors.otp}</p>
        )}
      </div>

      <div className="text-center">
        <button className="text-primary hover:text-secondary text-sm">
          {content[language].form.resendOtp}
        </button>
      </div>

      <button onClick={handleVerifyOtp} className="btn-primary w-full">
        {content[language].buttons.verify}
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Upload" size={32} color="#4a7c59" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          {content[language].form.document}
        </h3>
        <p className="text-text-secondary text-sm">
          {content[language].form.documentHelp}
        </p>
      </div>

      <div>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          className="form-input"
        />
        {formData.document && (
          <p className="text-success text-sm mt-2">
            {formData.document.name}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={() => setCurrentStep(4)} 
          className="btn-outline flex-1"
        >
          {language === 'en' ? 'Skip' : 'छोड़ें'}
        </button>
        <button 
          onClick={handleSubmit} 
          className="btn-primary flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{language === 'en' ? 'Processing...' : 'प्रसंस्करण...'}</span>
            </div>
          ) : (
            content[language].buttons.submit
          )}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle" size={40} color="white" />
      </div>
      
      <div>
        <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">
          {content[language].success.title}
        </h3>
        <p className="text-text-secondary mb-4">
          {content[language].success.message}
        </p>
        <div className="bg-background p-4 rounded-lg">
          <p className="text-primary font-medium">
            {content[language].success.membershipId}001
          </p>
        </div>
      </div>

      <button onClick={handleClose} className="btn-primary w-full">
        {content[language].buttons.close}
      </button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={currentStep < 4 ? content[language].title : ''}
      size="md"
    >
      {/* Progress Indicator */}
      {currentStep < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-white' :'bg-background text-text-secondary'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-background'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary text-center">
            {content[language].steps[currentStep]}
          </p>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </Modal>
  );
};

export default MemberRegistrationModal;