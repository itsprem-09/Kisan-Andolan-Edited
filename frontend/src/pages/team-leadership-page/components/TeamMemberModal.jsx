import React from 'react';
import Modal from 'components/ui/Modal';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const TeamMemberModal = ({ member, isOpen, onClose }) => {
  if (!member) return null;

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
                alt={member.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="flex-1 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-primary">
                {member.name}
              </h2>
              <p className="text-lg text-secondary font-medium">
                {member.role}
              </p>
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
            About
          </h3>
          <div className="prose prose-sm max-w-none text-text-secondary">
            <p className="font-body leading-relaxed whitespace-pre-line">
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TeamMemberModal;