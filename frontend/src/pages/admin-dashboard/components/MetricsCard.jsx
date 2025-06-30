import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, description }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return 'TrendingUp';
      case 'decrease':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Icon name={icon} size={24} color="#4a7c59" />
            </div>
            <div>
              <h3 className="text-sm font-caption font-medium text-text-secondary uppercase tracking-wider">
                {title}
              </h3>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {value}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {description}
            </p>
            
            <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor()}`}>
              <Icon name={getChangeIcon()} size={14} />
              <span>{change}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;