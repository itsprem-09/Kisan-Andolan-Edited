import React from 'react';
import Modal from 'components/ui/Modal';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';

const TeamMemberModal = ({ member, isOpen, onClose }) => {
  if (!member) return null;
  
  const { language, getTranslation } = useLanguage();
  
  // Use Hindi content if available and language is Hindi
  const displayName = language === 'hi' && member.hindi_name ? member.hindi_name : member.name;
  const displayRole = language === 'hi' && member.hindi_role ? member.hindi_role : member.role;
  const displayDescription = language === 'hi' && member.hindi_description ? member.hindi_description : member.description;
  
  // Get translated region name
  const getRegionTranslation = (region) => {
    if (!region) return '';
    
    // Map English region names to translation keys
    const regionMap = {
      'National': 'national',
      'North India': 'infoNorthIndia',
      'South India': 'infoSouthIndia',
      'East India': 'infoEastIndia',
      'West India': 'infoWestIndia',
      'Central India': 'centralIndia'
    };
    
    const translationKey = regionMap[region];
    return translationKey ? getTranslation(translationKey) : region;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title={null}
    >
      <div className="space-y-8">
        {/* Header Section with Clean Design */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-gray-100">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 shadow-md">
              <Image
                src={member.photo}
                alt={displayName}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="flex-1 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-primary">
                {displayName}
              </h2>
              <p className="text-lg text-secondary font-medium">
                {displayRole}
              </p>
              
              {/* Founder Badge */}
              {member.isFounder && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-light text-primary text-sm font-medium">
                  <Icon name="Star" size={14} className="mr-1" />
                  <TranslateText translationKey="founderInfo">Founder</TranslateText>
                </div>
              )}
            </div>
            
            {/* Contact Information */}
            {(member.email || member.phone) && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="Mail" size={18} className="text-primary" />
                    <span className="text-sm text-text-primary">{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="Phone" size={18} className="text-primary" />
                    <span className="text-sm text-text-primary">{member.phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">
            <TranslateText translationKey="about">About</TranslateText>
          </h3>
          <div className="prose prose-sm max-w-none text-text-secondary">
            <p className="font-body leading-relaxed whitespace-pre-line">
              {displayDescription}
            </p>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category & Region */}
          <div>
            {member.category && (
              <div className="mb-4">
                <h4 className="text-base font-medium text-text-primary mb-2">
                  <TranslateText translationKey="category">Category</TranslateText>
                </h4>
                <p className="text-text-secondary">{member.category}</p>
              </div>
            )}
            
            {member.region && (
              <div>
                <h4 className="text-base font-medium text-text-primary mb-2">
                  <TranslateText translationKey="region">Region</TranslateText>
                </h4>
                <p className="text-text-secondary">{getRegionTranslation(member.region)}</p>
              </div>
            )}
          </div>
          
          {/* Social Media Links */}
          {member.socialLinks && (
            <div>
              <h4 className="text-base font-medium text-text-primary mb-3">
                <TranslateText translationKey="socialProfiles">Social Profiles</TranslateText>
              </h4>
              <div className="flex flex-wrap gap-3">
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-[#0077B5] text-white hover:bg-opacity-90 transition-colors"
                  >
                    <Icon name="Linkedin" size={18} className="mr-2" />
                    <span>LinkedIn</span>
                  </a>
                )}
                
                {member.socialLinks.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-colors"
                  >
                    <Icon name="Twitter" size={18} className="mr-2" />
                    <span>Twitter</span>
                  </a>
                )}
                
                {member.socialLinks.facebook && (
                  <a 
                    href={member.socialLinks.facebook} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-[#1877F2] text-white hover:bg-opacity-90 transition-colors"
                  >
                    <Icon name="Facebook" size={18} className="mr-2" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TeamMemberModal;