import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Modal from 'components/ui/Modal';
import timelineService from 'services/timelineService';
import DynamicForm from './DynamicForm';
import ConfirmModal from './ConfirmModal';

const TimelineManagement = () => {
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch timeline entries on component mount
  useEffect(() => {
    fetchTimelineEntries();
  }, []);

  const fetchTimelineEntries = async () => {
    try {
      setLoading(true);
      console.log('Fetching timeline entries...');
      const response = await timelineService.getTimelines();
      console.log('Timeline response:', response);

      // Handle different response formats
      if (response.data) {
        setTimelineEntries(response.data);
      } else if (Array.isArray(response)) {
        setTimelineEntries(response);
      } else {
        // If no recognizable data format, set empty array
        setTimelineEntries([]);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch timeline entries:', err);
      // Check if there's a connection issue or if the server is not running
      if (err.message === 'Network Error') {
        setError('Cannot connect to the server. Please make sure the backend is running.');
      } else if (err.response?.status === 404) {
        // If we get a 404, it means the endpoint exists but is empty
        setTimelineEntries([]);
        setError(null);
      } else {
        setError('Failed to load timeline entries. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () => {
    setCurrentEntry({
      title: '',
      hindi_title: '',
      description: '',
      hindi_description: '',
      date: new Date().toISOString().split('T')[0],
      gallery: [],
      isKeyMilestone: false,
      impact: '',
      hindi_impact: '',
      achievement: ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry({
      ...entry,
      date: new Date(entry.date).toISOString().split('T')[0],
      hindi_title: entry.hindi_title || '',
      hindi_description: entry.hindi_description || '',
      hindi_impact: entry.hindi_impact || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteEntry = (entry) => {
    setCurrentEntry(entry);
    setShowDeleteModal(true);
  };

  const validateForm = (data) => {
    const errors = {};
    // For FormData objects, get the values directly
    if (data instanceof FormData) {
      if (!data.get('title')) errors.title = 'Title is required';
      if (!data.get('description')) errors.description = 'Description is required';
      if (!data.get('date')) errors.date = 'Date is required';
    } else {
      // For regular objects
      if (!data.title?.trim()) errors.title = 'Title is required';
      if (!data.description?.trim()) errors.description = 'Description is required';
      if (!data.date) errors.date = 'Date is required';
    }
    return errors;
  };

  const handleSubmitAdd = async (formData) => {
    try {
      console.log('Submitting timeline data...');
      // FormData is already properly formatted by DynamicForm
      const result = await timelineService.createTimeline(formData);
      console.log('Timeline creation result:', result);

      setShowAddModal(false);
      fetchTimelineEntries();
    } catch (err) {
      console.error('Failed to create timeline entry:', err);
      setFormErrors({ submit: 'Failed to create timeline entry. Please try again.' });
    }
  };

  const handleSubmitEdit = async (formData) => {
    try {
      console.log('Updating timeline data...');
      // Pass the FormData directly
      await timelineService.updateTimeline(currentEntry._id, formData);
      setShowEditModal(false);
      fetchTimelineEntries();
    } catch (err) {
      console.error('Failed to update timeline entry:', err);
      setFormErrors({ submit: 'Failed to update timeline entry. Please try again.' });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await timelineService.deleteTimeline(currentEntry._id);
      setShowDeleteModal(false);
      fetchTimelineEntries();
    } catch (err) {
      console.error('Failed to delete timeline entry:', err);
      setError('Failed to delete timeline entry. Please try again later.');
    }
  };

  const formFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter title',
      required: true
    },
    {
      name: 'hindi_title',
      label: 'Hindi Title',
      type: 'text',
      placeholder: 'Enter title in Hindi',
      required: false
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
      required: true
    },
    {
      name: 'hindi_description',
      label: 'Hindi Description',
      type: 'textarea',
      placeholder: 'Enter description in Hindi',
      required: false
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      placeholder: 'Select date',
      required: true
    },
    {
      name: 'impact',
      label: 'Impact',
      type: 'textarea',
      placeholder: 'Describe the impact (optional)'
    },
    {
      name: 'hindi_impact',
      label: 'Hindi Impact',
      type: 'textarea',
      placeholder: 'Describe the impact in Hindi (optional)'
    },
    {
      name: 'isKeyMilestone',
      label: 'Key Milestone',
      type: 'checkbox',
      description: 'Mark as a key milestone'
    },
    {
      name: 'achievement',
      label: 'Achievement',
      type: 'select',
      options: [
        { value: 'Debt Relief Assistance', label: 'Debt Relief Assistance' },
        { value: 'Organic Farming Training', label: 'Organic Farming Training' },
        { value: 'Access to Agricultural Equipment', label: 'Access to Agricultural Equipment' },
        { value: 'Farmer Market Linkage Programs', label: 'Farmer Market Linkage Programs' },
        { value: 'Crop Insurance Enrollment Drive', label: 'Crop Insurance Enrollment Drive' },
        { value: "Children's Education Support", label: "Children's Education Support" },
        { value: 'Water Conservation & Irrigation Projects', label: 'Water Conservation & Irrigation Projects' },
        { value: 'Rural Health Camps & Mental Health Support', label: 'Rural Health Camps & Mental Health Support' }
      ]
    },
    {
      name: 'gallery',
      label: 'Image Gallery',
      type: 'file-multiple',
      multiple: true,
      accept: 'image/*',
      description: 'Upload images (maximum 10)',
      maxCount: 10
    }
  ];

  // Display loading state
  if (loading && timelineEntries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && timelineEntries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col justify-center items-center h-64">
          <Icon name="AlertTriangle" size={48} className="text-red-500 mb-4" />
          <p className="text-text-secondary">{error}</p>
          <button
            onClick={fetchTimelineEntries}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Timeline Management</h2>
        <button
          onClick={handleAddEntry}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>Add Timeline Entry</span>
        </button>
      </div>

      {/* Timeline entries list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Key Milestone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Achievement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Gallery
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {timelineEntries.length > 0 ? (
                timelineEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-background/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {format(new Date(entry.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary max-w-xs truncate">
                      {entry.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {entry.isKeyMilestone ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary max-w-xs truncate">
                      {entry.achievement ? entry.achievement : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {entry.gallery && entry.gallery.length > 0 ? (
                        <div className="flex -space-x-2">
                          {entry.gallery.slice(0, 3).map((img, index) => (
                            <div key={index} className="h-8 w-8 rounded-full border border-white overflow-hidden">
                              <Image
                                src={img.filePath || (typeof img === 'string' ? img : '/assets/images/no_image.png')}
                                alt={`Gallery ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          {entry.gallery.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-xs font-medium">
                              +{entry.gallery.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary text-xs">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Icon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-secondary">
                    <Icon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">No Timeline Entries</p>
                    <p className="text-sm">Create your first timeline entry to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Timeline Entry"
        size="lg"
      >
        {currentEntry && (
          <DynamicForm
            fields={formFields}
            initialData={currentEntry}
            onSubmit={handleSubmitAdd}
            errors={formErrors}
            onCancel={() => setShowAddModal(false)}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Timeline Entry"
        size="lg"
      >
        {currentEntry && (
          <DynamicForm
            fields={formFields}
            initialData={currentEntry}
            onSubmit={handleSubmitEdit}
            errors={formErrors}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Timeline Entry"
        message="Are you sure you want to delete this timeline entry? This action cannot be undone."
        confirmLabel="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TimelineManagement; 