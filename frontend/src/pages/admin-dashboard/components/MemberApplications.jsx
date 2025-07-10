import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';
import memberService from '../../../services/memberService';
import nominationService from '../../../services/nominationService';
import { MEMBER_STATUS, DOCUMENT_TYPES } from '../../../config/constants';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import authService from '../../../services/authService';
import Modal from 'components/ui/Modal';
import Image from 'components/AppImage';
import NominationManagement from './NominationManagement';

const MemberApplications = () => {
  const [activeTab, setActiveTab] = useState('members');
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('members'); // 'members', 'youth', 'nominations'
  const [exportFormat, setExportFormat] = useState('excel'); // 'excel' or 'pdf'
  const [exportStatus, setExportStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  // New state variables for expanded filtering options
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [showExportSelectedDropdown, setShowExportSelectedDropdown] = useState(false);
  // Add alert modal state
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  // Helper function to show alerts
  const showAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };
  
  // Custom Alert Modal Component
  const AlertModal = ({ isOpen, onClose, message }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Alert" size="sm">
        <div className="p-4">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <Icon name="AlertTriangle" size={24} className="text-primary" />
            </div>
            <div className="text-text-primary">
              {message}
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    );
  };

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
        
        // Ensure we have valid data (array)
        if (Array.isArray(fetchedApplications)) {
          setApplications(fetchedApplications);
        } else if (fetchedApplications && Array.isArray(fetchedApplications.members)) {
          // Handle case where the API returns { members: [...] }
          setApplications(fetchedApplications.members);
        } else {
          // If we get unexpected data structure, set empty array
          console.error('Unexpected data format received:', fetchedApplications);
          setApplications([]);
          setError('Received invalid data format from the server');
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load member applications. Please try again.');
        console.error('Error fetching applications:', err);
        setApplications([]); // Ensure applications is at least an empty array
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Tab definitions
  const tabs = [
    { id: 'members', label: 'Member Applications', icon: 'Users' },
    { id: 'nominations', label: 'Award Nominations', icon: 'Award' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Applications', count: applications.length },
    { value: 'Pending', label: 'Pending', count: applications.filter(app => app.status === 'Pending').length },
    { value: 'Under Review', label: 'Under Review', count: applications.filter(app => app.status === 'Under Review').length },
    { value: 'Approved', label: 'Approved', count: applications.filter(app => app.status === 'Approved').length },
    { value: 'Rejected', label: 'Rejected', count: applications.filter(app => app.status === 'Rejected').length }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-500 text-white', label: 'Pending', icon: 'Clock' },
      'Under Review': { color: 'bg-blue-500 text-white', label: 'Under Review', icon: 'FileSearch' },
      'Approved': { color: 'bg-green-500 text-white', label: 'Approved', icon: 'CheckCircle' },
      'Rejected': { color: 'bg-red-500 text-white', label: 'Rejected', icon: 'XCircle' }
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm ${config.color}`}>
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
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded uppercase font-medium border border-blue-200">
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
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid (not Invalid Date)
      if (isNaN(date.getTime())) return 'N/A';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
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
          
          <div className="flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-accent text-secondary rounded-md hover:bg-accent-dark"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-700"
            >
              Delete Member
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Member Details Modal Component
  const MemberDetailsModal = ({ member, isOpen, onClose, getStatusBadge, formatDate }) => {
    if (!member) return null;

    const handleStatusChange = async (newStatus) => {
      await handleUpdateStatus(member._id, newStatus);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Member Application: ${member.name}`} size="lg">
        <div className="space-y-6 p-4">
          {/* Member Information */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold font-heading mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary">Application ID</p>
                    <p className="text-text-primary font-medium">{member.applicationId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary">Full Name</p>
                    <p className="text-text-primary font-medium">{member.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary">Mobile Number</p>
                    <p className="text-text-primary font-medium">{member.mobile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary">Email</p>
                    <p className="text-text-primary font-medium">{member.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Location</p>
                  <p className="text-text-primary font-medium">{member.district}, {member.state}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Occupation</p>
                  <p className="text-text-primary font-medium">{member.occupation}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Member Type</p>
                  <p className="text-text-primary font-medium">{member.membershipType || member.memberType || 'General Member'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Land Holding</p>
                  <p className="text-text-primary font-medium">{member.landHolding || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ID Verification */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold font-heading mb-4">ID Verification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">ID Type</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getDocumentBadge(member.idType)}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">ID Number</p>
                  <p className="text-text-primary font-medium">{member.idNumber || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">ID Document</p>
                  {member.idProofUrl ? (
                    <a 
                      href={member.idProofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <Icon name="ExternalLink" size={16} className="mr-1" />
                      View Document
                    </a>
                  ) : (
                    <p className="text-text-secondary">Not provided</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Photo</p>
                  {member.photoUrl ? (
                    <div className="mt-1 h-24 w-24 rounded-md overflow-hidden border border-border">
                      <Image 
                        src={member.photoUrl} 
                        alt={`Photo of ${member.name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-text-secondary">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status and Actions */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold font-heading mb-2">Application Status</h3>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(member.status)}
                  <span className="text-text-secondary text-sm">
                    Applied on {formatDate(member.createdAt)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold font-heading mb-2">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {member.status !== 'Under Review' && (
                    <button 
                      onClick={() => handleStatusChange('Under Review')}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    >
                      Mark for Review
                    </button>
                  )}
                  
                  {member.status !== 'Approved' && (
                    <button 
                      onClick={() => handleStatusChange('Approved')}
                      className="px-3 py-1 bg-success text-white rounded-md text-sm hover:bg-success-dark"
                    >
                      Approve
                    </button>
                  )}
                  
                  {member.status !== 'Rejected' && (
                    <button 
                      onClick={() => handleStatusChange('Rejected')}
                      className="px-3 py-1 bg-error text-white rounded-md text-sm hover:bg-error-dark"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = authService.getToken();
      
      if (!token) {
        showAlert('Authentication token not found. Please log in again.');
        setIsExporting(false);
        return;
      }
      
      // Create filters object with all filtering options
      const filters = {
        status: exportStatus === 'all' ? undefined : exportStatus,
        startDate: exportStartDate || undefined,
        endDate: exportEndDate || undefined
      };
      
      // Check if any filter is applied
      const hasActiveFilters = exportStatus !== 'all' || exportStartDate || exportEndDate;
      
      // First check if there are any records matching the filter before exporting
      if (exportType === 'members') {
        if (hasActiveFilters) {
          try {
            const filteredMembers = await memberService.checkFilteredMembers(filters, token);
            if (!filteredMembers) {
              showAlert('No member applications found with the selected filters. Please adjust your filters and try again.');
              setIsExporting(false);
              return;
            }
          } catch (checkError) {
            console.error('Error checking filtered members:', checkError);
            showAlert('Failed to check filtered members. Please try again.');
            setIsExporting(false);
            return;
          }
        }
        
        if (exportFormat === 'excel') {
          await memberService.exportMembersToExcel(filters, token);
        } else {
          await memberService.exportMembersToPdf(filters, token);
        }
      } else if (exportType === 'youth') {
        if (hasActiveFilters) {
          try {
            const filteredYouth = await memberService.checkFilteredYouth(filters, token);
            if (!filteredYouth) {
              showAlert('No youth leadership applications found with the selected filters. Please adjust your filters and try again.');
              setIsExporting(false);
              return;
            }
          } catch (checkError) {
            console.error('Error checking filtered youth:', checkError);
            showAlert('Failed to check filtered youth applications. Please try again.');
            setIsExporting(false);
            return;
          }
        }
        
        if (exportFormat === 'excel') {
          await memberService.exportYouthToExcel(filters, token);
        } else {
          await memberService.exportYouthToPdf(filters, token);
        }
      } else if (exportType === 'nominations') {
        if (hasActiveFilters) {
          try {
            const filteredNominations = await nominationService.checkFilteredNominations(filters, token);
            if (!filteredNominations) {
              showAlert('No nominations found with the selected filters. Please adjust your filters and try again.');
              setIsExporting(false);
              return;
            }
          } catch (checkError) {
            console.error('Error checking filtered nominations:', checkError);
            showAlert('Failed to check filtered nominations. Please try again.');
            setIsExporting(false);
            return;
          }
        }
        
        if (exportFormat === 'excel') {
          await nominationService.exportNominationsToExcel(filters, token);
        } else {
          await nominationService.exportNominationsToPdf(filters, token);
        }
      }
      
      setShowExportModal(false);
    } catch (err) {
      showAlert(`Failed to export data. ${err.message || 'Please try again later.'}`);
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle individual PDF download
  const handleDownloadPdf = async (id) => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      if (activeTab === 'members') {
        await memberService.downloadMemberPdf(id, token);
      } else {
        await nominationService.downloadNominationPdf(id, token);
      }
    } catch (err) {
      setError(`Failed to download PDF. ${err.message}`);
      console.error('PDF download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Export Modal Component
  const ExportModal = ({ isOpen, onClose }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
        <div className="space-y-6 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Export Type</label>
              <select 
                className="w-full px-3 py-2 border border-border rounded-md"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                disabled={isExporting}
              >
                <option value="members">Member Applications</option>
                <option value="youth">Youth Leadership Applications</option>
                <option value="nominations">Award Nominations</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Export Format</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="exportFormat" 
                    value="excel" 
                    checked={exportFormat === 'excel'} 
                    onChange={() => setExportFormat('excel')}
                    disabled={isExporting}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2">Excel (.xlsx)</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="exportFormat" 
                    value="pdf" 
                    checked={exportFormat === 'pdf'} 
                    onChange={() => setExportFormat('pdf')}
                    disabled={isExporting}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2">PDF</span>
                </label>
              </div>
            </div>
            
            <div className="bg-accent bg-opacity-20 p-4 rounded-md">
              <h4 className="font-medium mb-3">Filter Options</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-border rounded-md"
                    value={exportStatus}
                    onChange={(e) => setExportStatus(e.target.value)}
                    disabled={isExporting}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    {exportType === 'nominations' && (
                      <>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Awarded">Awarded</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date From</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-md"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      disabled={isExporting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date To</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-md"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      disabled={isExporting}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-accent text-secondary rounded-md hover:bg-accent-dark"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center space-x-2"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Add a function to handle exporting selected members directly
  const handleExportSelected = async (format = 'pdf') => {
    try {
      if (selectedApplications.length === 0) {
        setError('No members selected for export. Please select at least one member.');
        return;
      }

      setIsExporting(true);
      const token = authService.getToken();
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsExporting(false);
        return;
      }
      
      // Directly export selected members without opening modal
      if (format === 'excel') {
        await memberService.exportSelectedMembersToExcel(selectedApplications, token);
      } else {
        await memberService.exportSelectedMembersToPdf(selectedApplications, token);
      }
    } catch (err) {
      setError(`Failed to export selected members. ${err.message}`);
      console.error('Export error:', err);
    } finally {
      setShowExportSelectedDropdown(false);
      setIsExporting(false);
    }
  };

  const renderMembers = () => (
    <>
      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-border">
          <nav className="flex flex-nowrap overflow-x-auto space-x-2 md:space-x-6">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                  filterStatus === filter.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-accent text-secondary text-xs px-2 py-0.5 rounded-full">
                  {filter.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="py-12">
          <div className="bg-error bg-opacity-10 border-l-4 border-error p-4 rounded-r">
            <div className="flex items-start">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 mr-3" />
              <div>
                <p className="text-error font-medium">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="text-sm text-text-secondary underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-12 text-center">
          <Icon name="Users" size={48} className="text-text-secondary opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No applications found</h3>
          <p className="text-text-secondary">
            {filterStatus === 'all' 
              ? 'There are no member applications submitted yet.' 
              : `There are no applications with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Member Type
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID Proof
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="w-24 px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-background-light transition-smooth">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        checked={selectedApplications.includes(application._id)}
                        onChange={() => handleSelectApplication(application._id)}
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-accent mr-3">
                          {application.photoUrl ? (
                            <img 
                              src={application.photoUrl} 
                              alt={application.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-secondary text-white text-xs font-bold">
                              {application.name ? application.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{application.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-600">{application.applicationId || 'No ID'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{application.mobile || application.phoneNumber || 'No contact'}</div>
                      <div className="text-xs text-gray-600">{application.email || 'No email'}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{application.district || application.village || 'Not specified'}</div>
                      <div className="text-xs text-gray-600">{application.state || application.city || 'Not specified'}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{application.membershipType || application.memberType || 'General Member'}</div>
                      <div className="text-xs text-gray-600">{application.occupation || 'Not specified'}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getDocumentBadge(application.idType) || (
                        <span className="text-sm text-gray-600">Not provided</span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status || 'Pending')}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-black font-medium">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewApplication(application._id)}
                          className="text-primary hover:text-primary-dark"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(application._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download PDF"
                        >
                          <Icon name="FileText" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(application._id)}
                          className="text-error hover:text-red-700"
                          title="Delete"
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

          {/* Pagination would go here */}
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
          }}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
        member={memberToDelete}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        message={alertMessage}
      />
    </>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold font-heading text-text-primary">Registration Management</h2>
          <p className="text-text-secondary">Manage member applications and award nominations</p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedApplications.length > 0 && activeTab === 'members' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedApplications.length} selected
              </span>
              <div className="border-l border-border h-6 mx-2" />
              <button
                onClick={() => handleBulkAction('review')}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 font-medium"
              >
                Mark for Review
              </button>
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 font-medium"
              >
                Reject
              </button>
              <div className="border-l border-border h-6 mx-2" />
              <div className="relative">
                <button
                  onClick={() => setShowExportSelectedDropdown(prev => !prev)}
                  className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-dark font-medium flex items-center"
                  type="button"
                >
                  <Icon name="Download" size={14} className="mr-1" />
                  <span>Export Selected</span>
                </button>
                {showExportSelectedDropdown && (
                  <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md border border-border py-1 z-10">
                    <button
                      onClick={() => {
                        handleExportSelected('excel');
                        setShowExportSelectedDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-secondary w-full text-left"
                    >
                      Excel
                    </button>
                    <button
                      onClick={() => {
                        handleExportSelected('pdf');
                        setShowExportSelectedDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-secondary w-full text-left"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setExportType(activeTab === 'members' ? 'members' : 'nominations');
              setShowExportModal(true);
            }}
            className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-dark flex items-center space-x-1"
          >
            <Icon name="Download" size={14} />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="mb-6">
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === tab.id
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'members' ? renderMembers() : <NominationManagement />}
      
      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        message={alertMessage}
      />
    </div>
  );
};

export default MemberApplications;