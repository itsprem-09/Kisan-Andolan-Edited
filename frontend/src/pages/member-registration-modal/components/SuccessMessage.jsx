import React from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

const SuccessMessage = ({ memberData, onClose }) => {
  const { language } = useLanguage();
  const membershipId = memberData?.membershipId || 'RKM-' + Math.floor(Math.random() * 900000 + 100000);

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-success bg-opacity-10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={48} className="text-success" />
        </div>
      </div>
      
      {/* Success Message */}
      <div>
        <h3 className="text-xl font-heading font-bold text-success mb-2">
          <TranslateText translationKey="registrationSuccessful">Registration Successful!</TranslateText>
        </h3>
        <p className="text-text-secondary">
          <TranslateText translationKey="registrationSuccessMessage">
            Your membership application has been successfully submitted.
          </TranslateText>
        </p>
      </div>
      
      {/* Membership Details */}
      <div className="bg-background rounded-lg border border-border p-6 max-w-md mx-auto">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">
              <TranslateText translationKey="yourMembershipID">Your Membership ID</TranslateText>
            </p>
            <p className="text-lg font-mono font-semibold text-primary">{membershipId}</p>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium flex items-center justify-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-warning">
                <TranslateText translationKey="membershipStatusPending">
                  Your membership status: Pending
                </TranslateText>
              </span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              <TranslateText translationKey="verificationMessage">
                Our team will verify your documents and contact you within 24-48 hours.
              </TranslateText>
            </p>
          </div>
        </div>
      </div>
      
      {/* What Happens Next */}
      <div className="max-w-md mx-auto pt-4">
        <h4 className="text-lg font-heading font-semibold text-text-primary mb-4">
          <TranslateText translationKey="whatHappensNext">What Happens Next?</TranslateText>
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <p className="text-sm text-text-secondary">
              <TranslateText translationKey="receiveConfirmationEmail">
                You'll receive a confirmation email
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <p className="text-sm text-text-secondary">
              <TranslateText translationKey="teamWillVerify">
                Our team will verify your details
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <p className="text-sm text-text-secondary">
              <TranslateText translationKey="getMembershipCard">
                After verification, you'll get your digital membership card
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">4</span>
            </div>
            <p className="text-sm text-text-secondary">
              <TranslateText translationKey="joinCommunityActivities">
                You can join our community activities
              </TranslateText>
            </p>
          </div>
        </div>
      </div>
      
      {/* Return Button */}
      <div className="pt-6">
        <button
          onClick={onClose}
          className="btn-primary px-8 py-3"
        >
          <TranslateText translationKey="returnToHome">Return to Home Page</TranslateText>
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;