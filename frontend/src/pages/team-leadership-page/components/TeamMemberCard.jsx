import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TeamMemberCard = ({ member, onClick }) => {
  return (
    <div
      onClick={() => onClick(member)}
      className="card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
    >
      {/* Member Photo - Updated to match the Alok profile style */}
      <div className="relative">
        <div className="w-full h-72 overflow-hidden bg-gray-100">
          <Image
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Member Information - Card stacked at bottom of image */}
      <div className="p-6 bg-white border-t-4 border-primary space-y-3">
        <div>
          <h3 className="text-xl font-heading font-bold text-primary group-hover:text-secondary transition-colors">
            {member.name}
          </h3>
          <p className="text-secondary font-medium text-base mt-1">
            {member.role}
          </p>
        </div>

        <p className="text-text-secondary text-sm font-body line-clamp-3">
          {member.description}
        </p>

        {/* View Profile Link */}
        <div className="flex items-center justify-end pt-3 border-t border-border">
          <div className="flex items-center text-text-secondary group-hover:text-primary transition-colors">
            <span className="text-xs font-caption mr-1">View Profile</span>
            <Icon name="ChevronRight" size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;