import React from 'react';
import Icon from 'components/AppIcon';

const QuickAccessButtons = () => {
  const quickAccessItems = [
    { icon: 'FileText', label: 'Loan Applications' },
    { icon: 'Award', label: 'Certification Process' },
    { icon: 'CalendarCheck', label: 'Seasonal Calendars' },
    { icon: 'HelpCircle', label: 'FAQ & Support' },
  ];
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickAccessItems.map((item, index) => (
          <button 
            key={index}
            className="p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-smooth flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
              <Icon name={item.icon} size={24} color="#4a7c59" />
            </div>
            <span className="text-text-primary font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessButtons;