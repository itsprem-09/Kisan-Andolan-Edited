import React from 'react';
import Icon from 'components/AppIcon';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center mb-8">
      <div className="inline-flex bg-surface rounded-lg p-1 shadow-base border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 touch-target ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-primary hover:bg-background'
            }`}
          >
            <Icon 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.id ? 'white' : 'currentColor'} 
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;