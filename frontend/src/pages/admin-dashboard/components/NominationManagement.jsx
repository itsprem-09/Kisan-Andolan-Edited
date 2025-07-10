import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';
import nominationService from '../../../services/nominationService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import authService from '../../../services/authService';
import Modal from 'components/ui/Modal';
import Image from 'components/AppImage';

const NominationManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNominations, setSelectedNominations] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [selectedNomination, setSelectedNomination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nominationToDelete, setNominationToDelete] = useState(null);

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        setIsLoading(true);
        // Get token directly from authService
        const token = authService.getToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setIsLoading(false);
          return;
        }
        const response = await nominationService.getNominations({}, token);
        setNominations(response.nominations || []);
        setError(null);
      } catch (err) {
        setError('Failed to load nominations. Please try again.');
        console.error('Error fetching nominations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNominations();
  }, []);

  const statusFilters = [
    { value: 'all', label: 'All Nominations', count: nominations.length },
    { value: 'New', label: 'New', count: nominations.filter(nom => nom.status === 'New').length },
    { value: 'In Review', label: 'In Review', count: nominations.filter(nom => nom.status === 'In Review').length },
    { value: 'Shortlisted', label: 'Shortlisted', count: nominations.filter(nom => nom.status === 'Shortlisted').length },
    { value: 'Awarded', label: 'Awarded', count: nominations.filter(nom => nom.status === 'Awarded').length },
    { value: 'Rejected', label: 'Rejected', count: nominations.filter(nom => nom.status === 'Rejected').length }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'New': { color: 'bg-warning text-white', label: 'New', icon: 'FileText' },
      'In Review': { color: 'bg-blue-500 text-white', label: 'In Review', icon: 'FileSearch' },
      'Shortlisted': { color: 'bg-accent text-white', label: 'Shortlisted', icon: 'ThumbsUp' },
      'Awarded': { color: 'bg-success text-white', label: 'Awarded', icon: 'Award' },
      'Rejected': { color: 'bg-error text-white', label: 'Rejected', icon: 'XCircle' }
    };
    
    const config = statusConfig[status] || statusConfig.New;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const filteredNominations = filterStatus === 'all' 
    ? nominations 
    : nominations.filter(nom => nom.status === filterStatus);

  const handleSelectNomination = (nominationId) => {
    setSelectedNominations(prev => 
      prev.includes(nominationId)
        ? prev.filter(id => id !== nominationId)
        : [...prev, nominationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNominations.length === filteredNominations.length) {
      setSelectedNominations([]);
    } else {
      setSelectedNominations(filteredNominations.map(nom => nom._id));
    }
  };

  const handleBulkAction = async (action) => {
    try {
      setIsLoading(true);
      let status, notes;
      
      if (action === 'shortlist') {
        status = 'Shortlisted';
        notes = 'Bulk shortlisted';
      } else if (action === 'reject') {
        status = 'Rejected';
        notes = 'Bulk rejected';
      } else if (action === 'review') {
        status = 'In Review';
        notes = 'Marked for review';
      }
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // Update each selected nomination
      await Promise.all(
        selectedNominations.map(id => 
          nominationService.updateNominationStatus(id, status, notes, token)
        )
      );
      
      // Refresh the nominations list
      const response = await nominationService.getNominations({}, token);
      setNominations(response.nominations || []);
      setSelectedNominations([]);
      setError(null);
    } catch (err) {
      setError(`Failed to ${action} nominations. Please try again.`);
      console.error(`Error during bulk ${action}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNomination = (nominationId) => {
    const nomination = nominations.find(nom => nom._id === nominationId);
    if (nomination) {
      setSelectedNomination(nomination);
      setIsModalOpen(true);
    }
  };

  const handleUpdateStatus = async (nominationId, newStatus) => {
    try {
      setIsLoading(true);
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      await nominationService.updateNominationStatus(
        nominationId, 
        newStatus, 
        `Status changed to ${newStatus} by admin`, 
        token
      );
      
      // Refresh the nominations list
      const response = await nominationService.getNominations({}, token);
      setNominations(response.nominations || []);
      setError(null);
    } catch (err) {
      setError(`Failed to update status. Please try again.`);
      console.error('Error updating status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = (nominationId) => {
    const nomination = nominations.find(nom => nom._id === nominationId);
    if (nomination) {
      setNominationToDelete(nomination);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteNomination = async () => {
    if (!nominationToDelete) return;
    
    try {
      setIsLoading(true);
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      await nominationService.deleteNomination(nominationToDelete._id, token);
      
      // Refresh the nominations list
      const response = await nominationService.getNominations({}, token);
      setNominations(response.nominations || []);
      setError(null);
      setIsDeleteModalOpen(false);
      setNominationToDelete(null);
    } catch (err) {
      setError(`Failed to delete nomination. Please try again.`);
      console.error('Error deleting nomination:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadPdf = async (nominationId) => {
    try {
      setIsLoading(true);
      
      // Get token directly from authService
      const token = authService.getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      await nominationService.downloadNominationPdf(nominationId, token);
      
    } catch (err) {
      setError(`Failed to download PDF. ${err.message}`);
      console.error('PDF download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, nomination }) => {
    if (!nomination) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
        <div className="space-y-6 p-4">
          <div className="bg-error bg-opacity-10 border-l-4 border-error p-4 rounded-r">
            <div className="flex items-start">
              <Icon name="AlertTriangle" size={24} className="text-error mr-3" />
              <div>
                <h3 className="text-lg font-medium text-error">Warning: This action cannot be undone</h3>
                <p className="mt-2 text-text-secondary">
                  You are about to permanently delete the nomination for:
                </p>
                <p className="mt-1 font-medium text-text-primary">
                  {nomination.nomineeName} (Ref: {nomination.referenceNumber})
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
              Delete Nomination
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Nomination Details Modal Component
  const NominationDetailsModal = ({ nomination, isOpen, onClose, getStatusBadge, formatDate }) => {
    if (!nomination) return null;

    const handleStatusChange = async (newStatus) => {
      await handleUpdateStatus(nomination._id, newStatus);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Nomination Details: ${nomination.nomineeName}`} size="lg">
        <div className="space-y-6 p-4">
          {/* Nominee Information */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold font-heading mb-4">Nominee Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary">Reference Number</p>
                    <p className="text-text-primary font-medium">{nomination.referenceNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary">Full Name</p>
                    <p className="text-text-primary font-medium">{nomination.nomineeName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary">Age</p>
                      <p className="text-text-primary font-medium">{nomination.nomineeAge || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Gender</p>
                      <p className="text-text-primary font-medium">{nomination.nomineeGender || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary">Location</p>
                    <p className="text-text-primary font-medium">{nomination.district}, {nomination.state}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Occupation</p>
                  <p className="text-text-primary font-medium">{nomination.occupation}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Contribution</p>
                  <p className="text-text-primary">{nomination.contribution}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Nominated By</p>
                  <p className="text-text-primary font-medium">{nomination.nominatorName}</p>
                  <p className="text-text-secondary text-sm">{nomination.nominatorMobile}</p>
                  {nomination.nominatorEmail && (
                    <p className="text-text-secondary text-sm">{nomination.nominatorEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Verification */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold font-heading mb-4">Uploaded Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <p className="font-medium mb-2">Aadhar Card</p>
                {nomination.aadharCardPath ? (
                  <div className="space-y-2">
                    {nomination.aadharCardPath.includes('cloudinary.com') ? (
                      <div className="h-24 w-full overflow-hidden rounded bg-accent flex items-center justify-center">
                        <img 
                          src={nomination.aadharCardPath} 
                          alt="Aadhar Card" 
                          className="object-cover h-full w-full" 
                        />
                      </div>
                    ) : null}
                    <a 
                      href={nomination.aadharCardPath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <Icon name="ExternalLink" size={16} className="mr-1" />
                      View Document
                    </a>
                  </div>
                ) : (
                  <p className="text-text-secondary">Not provided</p>
                )}
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <p className="font-medium mb-2">Photograph</p>
                {nomination.photographPath ? (
                  <div className="space-y-2">
                    {nomination.photographPath.includes('cloudinary.com') ? (
                      <div className="h-24 w-full overflow-hidden rounded bg-accent flex items-center justify-center">
                        <img 
                          src={nomination.photographPath} 
                          alt="Nominee Photograph" 
                          className="object-cover h-full w-full" 
                        />
                      </div>
                    ) : null}
                    <a 
                      href={nomination.photographPath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <Icon name="ExternalLink" size={16} className="mr-1" />
                      View Document
                    </a>
                  </div>
                ) : (
                  <p className="text-text-secondary">Not provided</p>
                )}
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <p className="font-medium mb-2">Additional Document</p>
                {nomination.additionalDocumentPath ? (
                  <div className="space-y-2">
                    {nomination.additionalDocumentType === 'video_file' && nomination.additionalDocumentPath.includes('cloudinary.com') ? (
                      <div className="h-24 w-full overflow-hidden rounded bg-accent flex items-center justify-center">
                        <video 
                          src={nomination.additionalDocumentPath}
                          controls
                          className="h-full w-full"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : nomination.additionalDocumentPath.includes('cloudinary.com') ? (
                      <div className="h-24 w-full overflow-hidden rounded bg-accent flex items-center justify-center">
                        <img 
                          src={nomination.additionalDocumentPath} 
                          alt="Additional Document" 
                          className="object-cover h-full w-full" 
                        />
                      </div>
                    ) : null}
                    <a 
                      href={nomination.additionalDocumentPath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <Icon name="ExternalLink" size={16} className="mr-1" />
                      View {nomination.additionalDocumentType || 'Document'}
                    </a>
                  </div>
                ) : nomination.additionalDocumentUrl ? (
                  <a 
                    href={nomination.additionalDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <Icon name="ExternalLink" size={16} className="mr-1" />
                    View {nomination.additionalDocumentType || 'URL'}
                  </a>
                ) : (
                  <p className="text-text-secondary">Not provided</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Status and Actions */}
          <div className="bg-background-light p-6 rounded-lg border border-border">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold font-heading mb-2">Status</h3>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(nomination.status)}
                  <span className="text-text-secondary text-sm">
                    Submitted on {formatDate(nomination.createdAt)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold font-heading mb-2">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {nomination.status !== 'In Review' && (
                    <button 
                      onClick={() => handleStatusChange('In Review')}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 font-medium"
                    >
                      Mark for Review
                    </button>
                  )}
                  
                  {nomination.status !== 'Shortlisted' && (
                    <button 
                      onClick={() => handleStatusChange('Shortlisted')}
                      className="px-3 py-1.5 bg-accent text-white rounded-md text-sm hover:bg-accent/80 font-medium"
                    >
                      Shortlist
                    </button>
                  )}
                  
                  {nomination.status !== 'Awarded' && (
                    <button 
                      onClick={() => handleStatusChange('Awarded')}
                      className="px-3 py-1.5 bg-success text-white rounded-md text-sm hover:bg-success-dark font-medium"
                    >
                      Award
                    </button>
                  )}
                  
                  {nomination.status !== 'Rejected' && (
                    <button 
                      onClick={() => handleStatusChange('Rejected')}
                      className="px-3 py-1.5 bg-error text-white rounded-md text-sm hover:bg-error-dark font-medium"
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold font-heading text-text-primary">Kisan Gaurav Puraskar Nominations</h2>
          <p className="text-text-secondary">Manage and process award nominations</p>
        </div>

        {selectedNominations.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {selectedNominations.length} selected
            </span>
            <div className="border-l border-border h-6 mx-2" />
            <button
              onClick={() => handleBulkAction('review')}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 font-medium"
            >
              Mark for Review
            </button>
            <button
              onClick={() => handleBulkAction('shortlist')}
              className="px-3 py-1.5 bg-accent text-white rounded-md text-sm hover:bg-accent/80 font-medium"
            >
              Shortlist
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="px-3 py-1.5 bg-error text-white rounded-md text-sm hover:bg-error-dark font-medium"
            >
              Reject
            </button>
          </div>
        )}
      </div>

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
      ) : filteredNominations.length === 0 ? (
        <div className="py-12 text-center">
          <Icon name="Award" size={48} className="text-text-secondary opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No nominations found</h3>
          <p className="text-text-secondary">
            {filterStatus === 'all' 
              ? 'There are no nominations submitted yet.' 
              : `There are no nominations with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background-light">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      checked={selectedNominations.length === filteredNominations.length && filteredNominations.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Nominee
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Ref Number
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Occupation
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="w-24 px-3 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {filteredNominations.map((nomination) => (
                  <tr key={nomination._id} className="hover:bg-background-light transition-smooth">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        checked={selectedNominations.includes(nomination._id)}
                        onChange={() => handleSelectNomination(nomination._id)}
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{nomination.nomineeName}</p>
                          <p className="text-xs text-text-secondary">
                            {nomination.nomineeAge && `${nomination.nomineeAge} years`}
                            {nomination.nomineeGender && nomination.nomineeAge && ', '}
                            {nomination.nomineeGender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{nomination.referenceNumber}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{nomination.district}</div>
                      <div className="text-xs text-text-secondary">{nomination.state}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{nomination.occupation}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(nomination.status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {formatDate(nomination.createdAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewNomination(nomination._id)}
                          className="text-primary hover:text-primary-dark"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(nomination._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download PDF"
                        >
                          <Icon name="FileText" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(nomination._id)}
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
      {selectedNomination && (
        <NominationDetailsModal
          nomination={selectedNomination}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNomination(null);
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
          setNominationToDelete(null);
        }}
        onConfirm={handleDeleteNomination}
        nomination={nominationToDelete}
      />
    </div>
  );
};

export default NominationManagement; 