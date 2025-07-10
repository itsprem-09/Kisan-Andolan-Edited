import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import NomineeDetailsForm from './components/NomineeDetailsForm';
import DocumentUpload from './components/DocumentUpload';
import SuccessMessage from './components/SuccessMessage';
import nominationService from '../../services/nominationService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../contexts/LanguageContext';


const NominationFormModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nomineeName: '',
    nomineeAge: '',
    nomineeGender: '',
    district: '',
    state: '',
    occupation: '',
    contribution: '',
    nominatorName: '',
    nominatorMobile: '',
    nominatorEmail: '',
    documents: {
      aadharCard: null,
      photograph: null,
      additionalDocument: null,
      additionalDocumentType: 'none',
    },
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [registeredNomination, setRegisteredNomination] = useState(null);

  const steps = [
    { id: 1, title: <TranslateText translationKey="nomineeDetails">Nominee Details</TranslateText>, icon: 'User' },
    { id: 2, title: <TranslateText translationKey="documentUpload">Document Upload</TranslateText>, icon: 'Upload' },
    { id: 3, title: <TranslateText translationKey="confirmation">Confirmation</TranslateText>, icon: 'CheckCircle' }
  ];

  useEffect(() => {
    // Auto-open modal when component mounts
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/homepage');
    }
  };

  const handleStepComplete = async (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep === 1) {
      // Store nominee data in localStorage for recovery if needed
      localStorage.setItem('nominee_name', stepData.nomineeName || formData.nomineeName);
      localStorage.setItem('nominator_name', stepData.nominatorName || formData.nominatorName);
      localStorage.setItem('nominator_mobile', stepData.nominatorMobile || formData.nominatorMobile);
      setCurrentStep(2);
    } 
    else if (currentStep === 2) {
      try {
        setIsLoading(true);
        setApiError(null);
        
        // Create a new merged data object to ensure all form data is included
        const completeFormData = {
          ...formData,
          ...stepData
        };
        
        console.log('Preparing to submit nomination data:', {
          nomineeName: completeFormData.nomineeName,
          nomineeAge: completeFormData.nomineeAge,
          nomineeGender: completeFormData.nomineeGender,
          district: completeFormData.district,
          state: completeFormData.state,
          documentCount: completeFormData.documents ? Object.keys(completeFormData.documents).length : 0,
          hasAadhar: !!completeFormData.documents?.aadharCard,
          hasPhoto: !!completeFormData.documents?.photograph
        });
        
        // Call the nomination service to submit the nomination
        const result = await nominationService.submitNomination(completeFormData);
        console.log('Nomination submission successful, result:', result);
        
        if (result && result.nomination) {
          setRegisteredNomination(result.nomination);
          setCurrentStep(3);
        } else {
          throw new Error('Nomination submission failed - invalid response format');
        }
      } catch (error) {
        console.error('Nomination submission error:', error);
        setApiError(error.message || 'Failed to submit nomination. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Generate a reference number (used as fallback if API doesn't provide one)
  const generateReferenceNumber = () => {
    // Generate a unique reference number in the format RKM-VPGP-2025-XXXX
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `RKM-VPGP-${year}-${random}`;
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <NomineeDetailsForm
            formData={formData}
            errors={errors}
            onComplete={handleStepComplete}
            setErrors={setErrors}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <DocumentUpload
            formData={formData}
            onComplete={handleStepComplete}
            onBack={handlePreviousStep}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <SuccessMessage
            nominationData={registeredNomination || formData}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Modal
        isOpen={true}
        onClose={handleClose}
        size="xl"
        showCloseButton={currentStep !== 3}
        closeOnBackdrop={currentStep !== 3}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={32} color="white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary mb-2">
              <TranslateText translationKey="vpSinghAward">VP Singh – Kisan Gaurav Puraskar</TranslateText>
            </h1>
            <p className="text-text-secondary font-body">
              <TranslateText translationKey="nominationDesc">Nominate outstanding individuals who have made significant contributions to rural development</TranslateText>
            </p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 bg-error bg-opacity-10 border-l-4 border-error p-4 rounded-md">
              <div className="flex items-start">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5 mr-3" />
                <div>
                  <p className="text-error font-medium">{apiError}</p>
                  <button 
                    onClick={() => setApiError(null)}
                    className="text-sm text-text-secondary underline mt-1"
                  >
                    <TranslateText translationKey="dismiss">Dismiss</TranslateText>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {currentStep < 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                      currentStep >= step.id 
                        ? 'bg-primary text-white' : 'bg-accent text-secondary'
                    }`}>
                      {isLoading && currentStep === step.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Icon name={step.icon} size={20} />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-smooth ${
                        currentStep > step.id ? 'bg-primary' : 'bg-accent'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <h2 className="text-lg font-heading font-semibold text-text-primary">
                  {steps[currentStep - 1]?.title}
                </h2>
                <p className="text-sm text-text-secondary">
                  <TranslateText dynamic={false}>Step {currentStep} of {steps.length - 1}</TranslateText>
                </p>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="animate-fade-in">
            {renderStepContent()}
          </div>

          {/* Footer */}
          {currentStep < 3 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary">
                <Icon name="Shield" size={16} />
                <span>
                  <TranslateText translationKey="informationSecure">Your information is secure and protected</TranslateText>
                </span>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs text-text-secondary">
                  <TranslateText translationKey="byContinuing">
                    By continuing, you agree to our{' '}
                  </TranslateText>{' '}
                  <button className="text-primary hover:underline">
                    <TranslateText translationKey="termsOfService">Terms of Service</TranslateText>
                  </button>{' '}
                  <TranslateText dynamic={false}>and</TranslateText>{' '}
                  <button className="text-primary hover:underline">
                    <TranslateText translationKey="privacyPolicy">Privacy Policy</TranslateText>
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NominationFormModal; 