import React from 'react';
import Icon from 'components/AppIcon';

const QuickActions = ({ actions, onActionClick }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Quick Actions
        </h2>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.action)}
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-background transition-smooth text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:bg-primary transition-smooth">
                <Icon 
                  name={action.icon} 
                  size={20} 
                  className="text-secondary group-hover:text-white transition-smooth" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-smooth">
                    {action.title}
                  </h3>
                  {action.count && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;