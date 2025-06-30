import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';
import memberService from '../../../services/memberService';
import { MEMBER_STATUS, DOCUMENT_TYPES } from '../../../config/constants';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import authService from '../../../services/authService';
import Modal from 'components/ui/Modal';
import Image from 'components/AppImage';

const MemberApplications = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        // Get token directly from authService instead of currentUser
        const token = authService.getToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setIsLoading(false);
          return;
        }
        const fetchedApplications = await memberService.getMemberApplications(token);
        setApplications(fetchedApplications);
        setError(null);
      } catch (err) {
        setError('Failed to load member applications. Please try again.');
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusFilters = [
    { value: 'all', label: 'All Applications', count: applications.length },
    { value: 'Pending', label: 'Pending', count: applications.filter(app => app.status === 'Pending').length },
    { value: 'Under Review', label: 'Under Review', count: applications.filter(app => app.status === 'Under Review').length },
    { value: 'Approved', label: 'Approved', count: applications.filter(app => app.status === 'Approved').length },
    { value: 'Rejected', label: 'Rejected', count: applications.filter(app => app.status === 'Rejected').length }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-warning text-white', label: 'Pending', icon: 'Clock' },
      'Under Review': { color: 'bg-blue-500 text-white', label: 'Under Review', icon: 'FileSearch' },
      'Approved': { color: 'bg-success text-white', label: 'Approved', icon: 'CheckCircle' },
      'Rejected': { color: 'bg-error text-white', label: 'Rejected', icon: 'XCircle' }
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getDocumentBadge = (documentType) => {
    if (!documentType || documentType === 'Not Provided') {
      return null;
    }
    
    return (
      <span className="px-2 py-1 bg-accent text-secondary text-xs rounded uppercase font-medium">
        {documentType}
      </span>
    );
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app._id));
    }
  };

  const handleBulkAction = async (action) => {
    try {
      setIsLoading(true);
      let status, notes;
      
      if (action === 'approve') {
        status = 'Approved';
        notes = 'Bulk approved';
      } else if (action === 'reject') {
        status = 'Rejected';
        notes = 'Bulk rejected';
      } else if (action === 'review') {
        status = 'Under Review';
        notes = 'Marked for review';
      }
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // Update each selected application
      await Promise.all(
        selectedApplications.map(id => 
          memberService.updateMemberStatus(id, status, notes, token)
        )
      );
      
      // Refresh the applications list
      const updatedApplications = await memberService.getMemberApplications(token);
      setApplications(updatedApplications);
      setSelectedApplications([]);
      setError(null);
    } catch (err) {
      setError(`Failed to ${action} applications. Please try again.`);
      console.error(`Error during bulk ${action}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplication = (applicationId) => {
    const member = applications.find(app => app._id === applicationId);
    if (member) {
      setSelectedMember(member);
      setIsModalOpen(true);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setIsLoading(true);
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      await memberService.updateMemberStatus(
        applicationId, 
        newStatus, 
        `Status changed to ${newStatus} by admin`, 
        token
      );
      
      // Refresh the applications list
      const updatedApplications = await memberService.getMemberApplications(token);
      setApplications(updatedApplications);
      setError(null);
    } catch (err) {
      setError(`Failed to update status. Please try again.`);
      console.error('Error updating status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = (applicationId) => {
    const member = applications.find(app => app._id === applicationId);
    if (member) {
      setMemberToDelete(member);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      setIsLoading(true);
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      await memberService.deleteMember(memberToDelete._id, token);
      
      // Refresh the applications list
      const updatedApplications = await memberService.getMemberApplications(token);
      setApplications(updatedApplications);
      setError(null);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (err) {
      setError(`Failed to delete member. Please try again.`);
      console.error('Error deleting member:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, member }) => {
    if (!member) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
        <div className="space-y-6 p-4">
          <div className="bg-error bg-opacity-10 border-l-4 border-error p-4 rounded-r">
            <div className="flex items-start">
              <Icon name="AlertTriangle" size={24} className="text-error mr-3" />
              <div>
                <h3 className="text-lg font-medium text-error">Warning: This action cannot be undone</h3>
                <p className="mt-2 text-text-secondary">
                  You are about to permanently delete the member application for:
                </p>
                <p className="mt-1 font-medium text-text-primary">
                  {member.name} (Application ID: {member.applicationId})
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md text-text-primary hover:bg-background transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-600 transition-smooth"
            >
              Delete Application
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Member Details Modal Component
  const MemberDetailsModal = ({ member, isOpen, onClose, getStatusBadge, formatDate }) => {
    if (!member) return null;
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Member Application Details">
        <div className="space-y-8 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Full Name</p>
                <p className="font-medium text-text-primary">{member.name}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Village</p>
                <p className="font-medium text-text-primary">{member.village}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">City</p>
                <p className="font-medium text-text-primary">{member.city}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Phone Number</p>
                <p className="font-medium text-text-primary">+91 {member.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Application ID</p>
                <p className="font-medium text-text-primary">{member.applicationId}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Membership Type</p>
                <p className="font-medium text-text-primary">{member.membershipType}</p>
              </div>
              
              {/* Youth Leadership Program specific fields */}
              {member.membershipType === 'Kisan Youth Leadership Program' && (
                <>
                  <div>
                    <p className="text-sm text-text-secondary">Age</p>
                    <p className="font-medium text-text-primary">{member.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Education</p>
                    <p className="font-medium text-text-primary">{member.education}</p>
                  </div>
                  {member.experience && (
                    <div className="col-span-2">
                      <p className="text-sm text-text-secondary">Experience</p>
                      <p className="font-medium text-text-primary">{member.experience}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Document Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Document Type</p>
                <p className="font-medium text-text-primary">{member.documentType || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Document Verification</p>
                <p className="font-medium text-text-primary">
                  {member.documentPhoto ? 'Document Uploaded' : 'No Document Uploaded'}
                </p>
              </div>
            </div>
            
            {member.documentPhoto && (
              <div className="mt-2">
                <p className="text-sm text-text-secondary mb-2">Document Preview</p>
                <div className="border rounded-lg overflow-hidden">
                  <Image 
                    src={member.documentPhoto} 
                    alt="Document" 
                    className="w-full h-auto max-h-48 object-contain" 
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Status Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Application Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Current Status</p>
                <div className="mt-1">{getStatusBadge(member.status)}</div>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Submission Date</p>
                <p className="font-medium text-text-primary">{formatDate(member.applicationDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-smooth ${
              filterStatus === filter.value
                ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary'
            }`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              filterStatus === filter.value
                ? 'bg-white bg-opacity-20' :'bg-accent text-secondary'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading overlay */}
      {isLoading && applications.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner size={24} />
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && applications.length > 0 && (
        <div className="bg-error bg-opacity-10 border-l-4 border-error p-4 rounded-r-md">
          <div className="flex items-start">
            <Icon name="AlertCircle" size={20} className="text-error mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-error">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-sm text-text-primary underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="card bg-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-text-primary">
                {selectedApplications.length} application(s) selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('review')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-smooth"
                disabled={isLoading}
              >
                <Icon name="FileSearch" size={16} className="mr-2" />
                Mark as Under Review
              </button>
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-primary text-sm px-4 py-2"
                disabled={isLoading}
              >
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="bg-error text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-smooth"
                disabled={isLoading}
              >
                <Icon name="XCircle" size={16} className="mr-2" />
                Reject
              </button>
              <button
                onClick={() => setSelectedApplications([])}
                className="p-2 rounded-md hover:bg-background transition-smooth"
                disabled={isLoading}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-primary"
                    disabled={isLoading}
                  />
                </th>
                <th className="text-left p-4 font-medium text-text-primary">Applicant</th>
                <th className="text-left p-4 font-medium text-text-primary">Type</th>
                <th className="text-left p-4 font-medium text-text-primary">Contact</th>
                <th className="text-left p-4 font-medium text-text-primary">Status</th>
                <th className="text-left p-4 font-medium text-text-primary">Documents</th>
                <th className="text-left p-4 font-medium text-text-primary">Submitted</th>
                <th className="text-left p-4 font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application._id} className="border-b border-border hover:bg-background transition-smooth">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application._id)}
                      onChange={() => handleSelectApplication(application._id)}
                      className="rounded border-border focus:ring-primary"
                      disabled={isLoading}
                    />
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-text-primary">
                        {application.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {application.village}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.membershipType === 'Kisan Youth Leadership Program' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {application.membershipType === 'Kisan Youth Leadership Program' ? 'Youth Program' : 'General Member'}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm text-text-primary">
                      +91 {application.phoneNumber}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    {getStatusBadge(application.status)}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {application.documentType !== 'Not Provided' ? (
                        getDocumentBadge(application.documentType)
                      ) : (
                        <span className="text-xs text-text-secondary">None</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm text-text-secondary">
                      {formatDate(application.applicationDate)}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewApplication(application._id)}
                        className="p-2 rounded-md hover:bg-background transition-smooth"
                        title="View Details"
                        disabled={isLoading}
                      >
                        <Icon name="Info" size={16} />
                      </button>
                      
                      {application.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(application._id, 'Under Review')}
                            className="p-2 rounded-md hover:bg-background transition-smooth text-blue-500"
                            title="Mark as Under Review"
                            disabled={isLoading}
                          >
                            <Icon name="FileSearch" size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application._id, 'Approved')}
                            className="p-2 rounded-md hover:bg-background transition-smooth text-success"
                            title="Approve"
                            disabled={isLoading}
                          >
                            <Icon name="CheckCircle" size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application._id, 'Rejected')}
                            className="p-2 rounded-md hover:bg-background transition-smooth text-error"
                            title="Reject"
                            disabled={isLoading}
                          >
                            <Icon name="XCircle" size={16} />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDeleteConfirmation(application._id)}
                        className="p-2 rounded-md hover:bg-background transition-smooth text-error"
                        title="Delete Application"
                        disabled={isLoading}
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-accent mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No Applications Found
            </h3>
            <p className="text-text-secondary">
              {filterStatus === 'all' ?'No member applications have been submitted yet.'
                : `No applications with status "${filterStatus}" found.`
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Member Details Modal */}
      <MemberDetailsModal 
        member={selectedMember} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        member={memberToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
      />
    </div>
  );
};

export default MemberApplications;