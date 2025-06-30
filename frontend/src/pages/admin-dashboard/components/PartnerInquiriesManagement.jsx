import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { getPartnerInquiries, updatePartnerInquiry, deletePartnerInquiry } from 'services/partnerInquiryService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Modal from 'components/ui/Modal';
import ConfirmModal from './ConfirmModal';

const PartnerInquiriesManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch partnership inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPartnerInquiries();
        setInquiries(response.data);
      } catch (err) {
        console.error('Failed to fetch partnership inquiries:', err);
        setError('Failed to load partnership inquiries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Status options
  const statusOptions = [
    { value: 'New', label: 'New', color: 'blue' },
    { value: 'In Review', label: 'In Review', color: 'yellow' },
    { value: 'Contacted', label: 'Contacted', color: 'purple' },
    { value: 'Completed', label: 'Completed', color: 'green' },
    { value: 'Rejected', label: 'Rejected', color: 'red' }
  ];

  // Tabs for filtering
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'inReview', label: 'In Review' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' }
  ];

  // Handle view inquiry
  const handleViewInquiry = (inquiry) => {
    setCurrentInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  // Handle update status
  const handleUpdateStatus = (inquiry) => {
    setCurrentInquiry(inquiry);
    setSelectedStatus(inquiry.status);
    setStatusNotes(inquiry.notes || '');
    setIsStatusModalOpen(true);
  };

  // Handle delete inquiry
  const handleDeleteInquiry = (inquiry) => {
    setCurrentInquiry(inquiry);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!currentInquiry) return;
    
    setLoading(true);
    try {
      await deletePartnerInquiry(currentInquiry._id);
      
      // Update local state
      setInquiries(inquiries.filter(item => item._id !== currentInquiry._id));
      setIsDeleteModalOpen(false);
      setCurrentInquiry(null);
    } catch (err) {
      console.error('Error deleting partnership inquiry:', err);
      setError('Failed to delete partnership inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm status update
  const handleConfirmStatusUpdate = async () => {
    if (!currentInquiry) return;
    
    setLoading(true);
    try {
      const response = await updatePartnerInquiry(currentInquiry._id, {
        status: selectedStatus,
        notes: statusNotes
      });
      
      // Update local state
      setInquiries(inquiries.map(item => 
        item._id === currentInquiry._id ? response.data : item
      ));
      
      setIsStatusModalOpen(false);
      setCurrentInquiry(null);
      setSelectedStatus('');
      setStatusNotes('');
    } catch (err) {
      console.error('Error updating partnership inquiry status:', err);
      setError('Failed to update partnership inquiry status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter inquiries based on active tab
  const filteredInquiries = inquiries.filter(inquiry => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new' && inquiry.status === 'New') return true;
    if (activeTab === 'inReview' && inquiry.status === 'In Review') return true;
    if (activeTab === 'contacted' && inquiry.status === 'Contacted') return true;
    if (activeTab === 'completed' && inquiry.status === 'Completed') return true;
    if (activeTab === 'rejected' && inquiry.status === 'Rejected') return true;
    return false;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-primary mb-6">Partnership Inquiries</h3>
        <div className="flex justify-center">
          <LoadingSpinner size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-primary mb-6">Partnership Inquiries</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Inquiries Table */}
      {filteredInquiries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {inquiry.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`mailto:${inquiry.email}`} className="text-blue-500 hover:underline">{inquiry.email}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {inquiry.organization || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(inquiry.status)}-100 text-${getStatusColor(inquiry.status)}-800`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewInquiry(inquiry)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Icon name="Eye" size={18} />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(inquiry)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      <Icon name="Edit" size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteInquiry(inquiry)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Icon name="Trash" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Icon name="InboxX" size={48} className="mx-auto" />
          </div>
          <p>No partnership inquiries found</p>
        </div>
      )}
      
      {/* View Inquiry Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Partnership Inquiry">
        {currentInquiry && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base">{currentInquiry.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">
                <a href={`mailto:${currentInquiry.email}`} className="text-blue-500 hover:underline">{currentInquiry.email}</a>
              </p>
            </div>
            {currentInquiry.organization && (
              <div>
                <p className="text-sm font-medium text-gray-500">Organization</p>
                <p className="text-base">{currentInquiry.organization}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Message</p>
              <p className="text-base whitespace-pre-wrap">{currentInquiry.message}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-base">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(currentInquiry.status)}-100 text-${getStatusColor(currentInquiry.status)}-800`}>
                  {currentInquiry.status}
                </span>
              </p>
            </div>
            {currentInquiry.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p className="text-base whitespace-pre-wrap">{currentInquiry.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Date Submitted</p>
              <p className="text-base">{formatDate(currentInquiry.createdAt)}</p>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Update Status Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Update Status">
        {currentInquiry && (
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Add notes about this partnership inquiry..."
              />
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <LoadingSpinner size={20} className="inline" />
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Partnership Inquiry"
        message="Are you sure you want to delete this partnership inquiry? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonColor="red"
        isLoading={loading}
      />
    </div>
  );
};

export default PartnerInquiriesManagement; 