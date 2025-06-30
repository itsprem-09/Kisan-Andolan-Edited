import React from 'react';

const LoadingSpinner = ({ size = 24, color = '#4a7c59' }) => {
  return (
    <div 
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        borderTopColor: 'transparent',
        borderColor: color
      }}
    ></div>
  );
};

export default LoadingSpinner; 