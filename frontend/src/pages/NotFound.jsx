import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertTriangle" size={48} color="#4a7c59" />
          </div>
          <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8 font-body">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/homepage"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Icon name="Home" size={20} />
            <span>Go to Homepage</span>
          </Link>
          
          <div className="text-sm text-text-secondary">
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;