import React from 'react';
import Modal from 'components/ui/Modal';
import Icon from 'components/AppIcon';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title || "Confirm Action"}
      size="md"
    >
      <div className="p-4">
        <div className="flex items-center mb-4 text-red-500">
          <Icon name="AlertTriangle" size={24} className="mr-2" />
          <h3 className="text-lg font-medium">{message || "Are you sure you want to proceed?"}</h3>
        </div>
        
        <p className="mb-6 text-text-secondary">
          This action cannot be undone. Please confirm that you want to proceed.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-smooth"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-smooth flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Icon name="Trash2" size={16} className="mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 