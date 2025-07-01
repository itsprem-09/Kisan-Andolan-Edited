import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { useAuth } from 'contexts/AuthContext';
import TranslateText from 'components/TranslateText';

// Import services
import mediaService from 'services/mediaService';
import bannerService from 'services/bannerService';
import programService from 'services/programService';
import projectService from 'services/projectService';
import teamService from 'services/teamService';
import informationService from 'services/informationService';
import DynamicForm from './DynamicForm';
import ConfirmModal from './ConfirmModal';
import { formatDistanceToNow } from 'date-fns';

const ContentManagement = () => {
  const { user } = useAuth();
  
  // State variables
  const [activeTab, setActiveTab] = useState('media');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [informationContent, setInformationContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const contentSections = [
    { id: 'media', title: 'Media Gallery', icon: 'Image', description: 'Manage photos and videos' },
    { id: 'programs', title: 'Programs', icon: 'Activity', description: 'Manage ongoing programs' },
    { id: 'projects', title: 'Upcoming Projects', icon: 'Zap', description: 'Manage future projects' },
    { id: 'team', title: 'Team Profiles', icon: 'Users', description: 'Manage team member information' },
    { id: 'information', title: 'Information Center', icon: 'FileText', description: 'Update articles and content' }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (activeTab) {
        case 'media':
          response = await mediaService.getMediaItems();
          console.log('Media items response:', response);
          setMediaItems(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'programs':
          response = await programService.getPrograms();
          setPrograms(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'projects':
          response = await projectService.getProjects();
          setProjects(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'team':
          response = await teamService.getTeamMembers();
          setTeamMembers(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'information':
          response = await informationService.getInformationItems();
          console.log('Information response:', response);

          const infoGroups = Array.isArray(response.data)
            ? response.data
            : (response.data?.data || []);

          const flattened = infoGroups.flatMap(group =>
            group.items.map(item => ({
              ...item,
              groupTitle: group.groupTitle,
            }))
          );

          setInformationContent(flattened);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab} data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);

    // Create a copy of the item to avoid modifying the original data
    const itemForEdit = { ...item };

    // For media items, ensure type field is properly mapped from fileType
    if (activeTab === 'media') {
      // Map fileType to type for the form
      if (itemForEdit.fileType === 'document') {
        itemForEdit.type = 'News Article';
      } else if (itemForEdit.fileType === 'video') {
        // Default to first video option
        itemForEdit.type = 'Documentary';
      }

      // Ensure mediaUrl is set from filePath if needed
      if (!itemForEdit.mediaUrl && itemForEdit.filePath) {
        itemForEdit.mediaUrl = itemForEdit.filePath;
      }

      // Ensure thumbnailUrl is set for video thumbnails
      if (itemForEdit.fileType === 'video') {
        if (!itemForEdit.thumbnailUrl && itemForEdit.thumbnailPath) {
          itemForEdit.thumbnailUrl = itemForEdit.thumbnailPath;
        }
      }
    }
    
    // For team members, map fields correctly
    if (activeTab === 'team') {
      // Map description to bio field for the form
      itemForEdit.bio = itemForEdit.description || '';
      
      // Map photo to image for the form
      itemForEdit.image = itemForEdit.photo || '';
      
      // Hindi fields are already named correctly, but make sure they are at least empty strings
      itemForEdit.hindi_name = itemForEdit.hindi_name || '';
      itemForEdit.hindi_role = itemForEdit.hindi_role || '';
      itemForEdit.hindi_description = itemForEdit.hindi_description || '';
      
      // Convert socialLinks object to comma-separated string for the form
      if (itemForEdit.socialLinks) {
        const links = [];
        if (itemForEdit.socialLinks.linkedin) links.push(itemForEdit.socialLinks.linkedin);
        if (itemForEdit.socialLinks.twitter) links.push(itemForEdit.socialLinks.twitter);
        if (itemForEdit.socialLinks.facebook) links.push(itemForEdit.socialLinks.facebook);
        
        itemForEdit.socialMedia = links.join(', ');
      }
      
      console.log('Team member prepared for edit:', itemForEdit);
    }

    console.log('Prepared for edit:', itemForEdit);
    setCurrentItem(itemForEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setError(null);
  };

  const handleDelete = (item) => {
    console.log('Preparing to delete item:', item);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    console.log(itemToDelete);
    
    if (!itemToDelete || !itemToDelete._id) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting to delete ${activeTab} item with ID: ${itemToDelete._id}`);

      let response;
      switch (activeTab) {
        case 'media':
          response = await mediaService.deleteMediaItem(itemToDelete._id);
          break;
        case 'programs':
          response = await programService.deleteProgram(itemToDelete._id);
          break;
        case 'projects':
          response = await projectService.deleteProject(itemToDelete._id);
          break;
        case 'team':
          response = await teamService.deleteTeamMember(itemToDelete._id);
          break;
        case 'information':
          response = await informationService.deleteInformationItem(itemToDelete.groupTitle, itemToDelete._id);
          break;
        default:
          throw new Error('Invalid content type for delete operation');
      }

      console.log(`Deletion response:`, response);

      // Close the modal
      handleCloseDeleteModal();

      // Refresh data after a short delay to ensure the backend has time to complete the deletion
      setTimeout(() => {
        fetchData();
      }, 500);

    } catch (err) {
      console.error(`Error deleting ${activeTab} item:`, err);
      setError(`Failed to delete item. ${err.response?.data?.message || err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData, additionalData = {}, processedData) => {
    setLoading(true);
    setError(null);

    const isRawFormData = formData instanceof FormData;
    const data = isRawFormData ? formData : new FormData();
    const { multipleFiles } = additionalData;

    // Log what we received
    console.log('Received form data is FormData:', isRawFormData);
    console.log('Processed form data:', processedData);
    
    // Debug the upload type field directly from the FormData
    if (isRawFormData) {
      console.log('Upload type from FormData:', formData.get('uploadType'));
      console.log('Video link from FormData:', formData.get('videoLink'));
    }

    // Only do this if formData is not already FormData (i.e., raw object)
    if (!isRawFormData) {
      console.log('Form data before processing:', formData);
      console.log('Additional form data:', additionalData);

      const isEditing = currentItem && currentItem._id;
      const fileFieldsToSkip = [];

      // For team members, handle field mappings
      if (activeTab === 'team') {
        // Map bio to description (backend field)
        if (formData.bio !== undefined) {
          data.append('description', formData.bio);
        }

        // Handle file field naming differences
        if (formData.image instanceof File) {
          data.append('photo', formData.image);
        }
        
        // Pass through other fields
        data.append('name', formData.name);
        data.append('hindi_name', formData.hindi_name || '');
        data.append('role', formData.role);
        data.append('hindi_role', formData.hindi_role || '');
        data.append('hindi_description', formData.hindi_description || '');
        data.append('email', formData.email || '');
        data.append('phone', formData.phone || '');
        
        if (formData.category) {
          data.append('category', formData.category);
        }
        
        if (formData.region) {
          data.append('region', formData.region);
        }
        
        // Handle isFounder checkbox
        if (formData.isFounder !== undefined) {
          data.append('isFounder', formData.isFounder);
        }
        
        // Handle social media links
        if (formData.socialMedia) {
          data.append('socialMedia', formData.socialMedia);
        }
      }
      else {
        // For media items, ensure uploadType is explicitly included and correct
        if (activeTab === 'media') {
          // Make sure uploadType is included for video types
          if ((formData.type === 'Documentary' || formData.type === 'Video Series')) {
            // If uploadType is missing, set a default based on presence of videoLink
            if (!formData.uploadType) {
              formData.uploadType = formData.videoLink ? 'Video Link' : 'Upload File';
              console.log(`Setting default uploadType: ${formData.uploadType}`);
            }
            
            // If upload type is "Upload File" but videoLink exists, clear it
            if (formData.uploadType === 'Upload File' && formData.videoLink) {
              console.log('Clearing videoLink since uploadType is Upload File');
              formData.videoLink = '';
            }
            
            // If upload type is "Video Link" but no videoLink, check if we have an existing one
            if (formData.uploadType === 'Video Link' && !formData.videoLink && currentItem?.videoLink) {
              console.log('Using existing videoLink:', currentItem.videoLink);
              formData.videoLink = currentItem.videoLink;
            }
          }
          
          console.log('Final uploadType and videoLink:', {
            uploadType: formData.uploadType,
            videoLink: formData.videoLink
          });
        }

        // Special case for editing: if we're switching from video link to file upload
        // but no file is provided, we need to warn the user
        if (isEditing && activeTab === 'media' && 
            currentItem.videoLink && 
            formData.uploadType === 'Upload File' && 
            !formData.mediafile) {
          console.log('Switching from video link to file upload without providing a file');
          // Note: The server will validate this case
        }

        if (isEditing) {
          const fileFields = ['mediafile', 'photo', 'image', 'coverImage', 'imageUrl', 'photoUrl'];
          fileFields.forEach(field => {
            if (field in formData && !formData[field]) {
              fileFieldsToSkip.push(field);
            }
          });
        }

        // Gallery handling
        const galleryFiles = formData.gallery;
        const galleryUrls = formData.galleryUrls;
        delete formData.gallery;
        delete formData.galleryUrls;

        // Handle file-based gallery
        if (galleryFiles && galleryFiles.length > 0) {
          for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            if (file instanceof File) {
              data.append('gallery', file);
            }
          }
          if (isEditing) {
            data.append('replaceGallery', 'true');
          }
        } 
        // Handle comma-separated URL gallery (primarily for media)
        else if (galleryUrls && galleryUrls.trim() !== '') {
          // Parse the comma-separated URLs
          const urls = galleryUrls.split(',')
            .map(url => url.trim())
            .filter(Boolean);
          
          // Add as array of URLs
          data.append('galleryUrls', JSON.stringify(urls));
        }
        
        // Handle all other fields by appending to FormData
        Object.entries(formData).forEach(([key, value]) => {
          // Skip fields we've already handled
          if (key === 'gallery' || key === 'galleryUrls') return;

          // Skip empty file fields when editing (or they'll clear existing values)
          if (isEditing && fileFieldsToSkip.includes(key)) {
            console.log(`Skipping empty file field: ${key}`);
            return;
          }
          
          // Skip any null/undefined values
          if (value === null || value === undefined) return;

          // Handle file objects
          if (value instanceof File) {
            data.append(key, value);
          }
          // Handle boolean values
          else if (typeof value === 'boolean') {
            data.append(key, value.toString());
          }
          // Handle arrays or objects by stringifying
          else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            data.append(key, JSON.stringify(value));
          }
          // Handle arrays
          else if (Array.isArray(value)) {
            // For multiselect values
            if (value.every(item => typeof item === 'string')) {
              data.append(key, value.join(','));
            } else {
              data.append(key, JSON.stringify(value));
            }
          }
          // Regular string/number values
          else {
            data.append(key, value);
          }
        });
      }
    }
    
    // For debugging, output all data being sent to the server
    if (!isRawFormData) {
      console.log('Final form data to be sent:');
      for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
    }

    try {
      let response;

      if (currentItem && currentItem._id) {
        // Update existing item
        console.log(`Updating ${activeTab} item with ID: ${currentItem._id}`);
        
        switch (activeTab) {
          case 'media':
            response = await mediaService.updateMediaItem(currentItem._id, data);
            break;
          case 'programs':
            response = await programService.updateProgram(currentItem._id, data);
            break;
          case 'projects':
            response = await projectService.updateProject(currentItem._id, data);
            break;
          case 'team':
            response = await teamService.updateTeamMember(currentItem._id, data);
            break;
          case 'information':
            // For information items, we need the group title
            const groupTitle = currentItem.groupTitle || processedData?.groupTitle || 'governmentSchemes';
            response = await informationService.updateInformationItem(groupTitle, currentItem._id, data);
            break;
          default:
            throw new Error('Invalid content type for update operation');
        }
      } else {
        // Create new item
        console.log(`Creating new ${activeTab} item`);
        
        switch (activeTab) {
          case 'media':
            response = await mediaService.createMediaItem(data);
            break;
          case 'programs':
            response = await programService.createProgram(data);
            break;
          case 'projects':
            response = await projectService.createProject(data);
            break;
          case 'team':
            response = await teamService.createTeamMember(data);
            break;
          case 'information':
            // For information items, get the group title from form data
            const groupTitle = processedData?.groupTitle || data.get('groupTitle') || 'governmentSchemes';
            response = await informationService.createInformationItem(data);
            break;
          default:
            throw new Error('Invalid content type for create operation');
        }
      }

      console.log(`${currentItem ? 'Update' : 'Create'} response:`, response);
      
      // Close the modal
      handleCloseModal();

      // Show success toast message
      showNotification(`The ${activeTab.slice(0, -1)} has been ${currentItem ? 'updated' : 'created'} successfully.`);

      // Refresh data
      fetchData();

    } catch (err) {
      console.error(`Error ${currentItem ? 'updating' : 'creating'} ${activeTab} item:`, err);
      const errorMessage = err.response?.data?.message || err.message || 'Please try again later.';
      setError(`Failed to ${currentItem ? 'update' : 'create'} item. ${errorMessage}`);
      
      // Show error toast message
      showNotification(`Failed to ${currentItem ? 'update' : 'create'} item. ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFormConfig = (contentType) => {
    // Basic field configurations shared across multiple forms
    const sharedFields = {
      mediaFields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'hindi_title', label: 'Hindi Title', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'textarea', required: false },
        { name: 'hindi_description', label: 'Hindi Description', type: 'textarea', required: false },
        { name: 'type', label: 'Type', type: 'select', options: ['Photo', 'Documentary', 'Video Series', 'Webinar', 'News Article'], required: true },
        // Additional fields are handled conditionally below
      ],
      programFields: [
        { name: 'name', label: 'Program Name', type: 'text', required: true },
        { name: 'hindi_name', label: 'Hindi Program Name', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'hindi_description', label: 'Hindi Description', type: 'textarea', required: false },
        { name: 'startDate', label: 'Start Date', type: 'date', required: false },
        { name: 'endDate', label: 'End Date', type: 'date', required: false },
        { name: 'location', label: 'Location', type: 'text', required: false },
        { name: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'Upcoming', 'Draft'], required: true },
        { name: 'beneficiaries', label: 'Beneficiaries', type: 'text', required: false },
        { name: 'programDuration', label: 'Program Duration', type: 'text', required: false },
        { name: 'coverImage', label: 'Cover Image', type: 'file', accept: 'image/*', required: false,
          existingImageUrl: currentItem?.coverImage || '' },
        { name: 'gallery', label: 'Gallery Images', type: 'file-multiple', accept: 'image/*', required: false }
      ],
      projectFields: [
        { name: 'name', label: 'Project Name', type: 'text', required: true },
        { name: 'hindi_name', label: 'Hindi Project Name', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'hindi_description', label: 'Hindi Description', type: 'textarea', required: false },
        { name: 'budget', label: 'Budget', type: 'text', required: true },
        { name: 'targetFarms', label: 'Target Farms', type: 'text', required: true },
        { name: 'expectedStartDate', label: 'Expected Start Date', type: 'date', required: false },
        { name: 'location', label: 'Location', type: 'text', required: false },
        { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'Draft'], required: true },
        { name: 'coverImage', label: 'Cover Image', type: 'file', accept: 'image/*', required: false,
          existingImageUrl: currentItem?.coverImage || '' },
        { name: 'gallery', label: 'Gallery Images', type: 'file-multiple', accept: 'image/*', required: false }
      ],
      teamFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'hindi_name', label: 'Hindi Full Name', type: 'text', required: false },
        { name: 'role', label: 'Role', type: 'text', required: true },
        { name: 'hindi_role', label: 'Hindi Role', type: 'text', required: false },
        { name: 'bio', label: 'Biography', type: 'textarea', required: false },
        { name: 'hindi_description', label: 'Hindi Biography', type: 'textarea', required: false },
        { name: 'category', label: 'Category', type: 'select', 
          options: ['Leadership', 'Core Team', 'Advisors', 'Regional Coordinators', 'Volunteers'], 
          required: true },
        { name: 'region', label: 'Region', type: 'select', 
          options: ['National', 'North India', 'South India', 'East India', 'West India', 'Central India'], 
          required: false },
        { name: 'email', label: 'Email', type: 'email', required: false },
        { name: 'phone', label: 'Phone', type: 'tel', required: false },
        { name: 'image', label: 'Profile Image', type: 'file', accept: 'image/*', required: false,
          existingImageUrl: currentItem?.image || '' },
        { name: 'isFounder', label: 'Is Founder?', type: 'checkbox', required: false },
        { name: 'socialMedia', label: 'Social Media Links (comma separated)', type: 'textarea', required: false,
          placeholder: 'https://twitter.com/handle, https://linkedin.com/in/profile' }
      ],
      informationFields: [
        { name: 'groupTitle', label: 'Information Group', type: 'select', 
          options: ['governmentSchemes', 'agriculturalResources', 'educationalMaterials', 'newsUpdates'], 
          required: true },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'hindi_title', label: 'Hindi Title', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'hindi_description', label: 'Hindi Description', type: 'textarea', required: false },
        { name: 'category', label: 'Category', type: 'select', 
          options: ['subsidy', 'certification', 'insurance', 'seasonal', 'sustainable', 'weather'], 
          required: true },
        { name: 'region', label: 'Region', type: 'select', 
          options: ['national', 'North India', 'South India', 'East India', 'West India', 'Central India'], 
          required: true },
        { name: 'uploadType', label: 'Upload Type', type: 'select', 
          options: ['None', 'Upload File', 'Video Link'], 
          required: false },
        // The following fields will be shown conditionally based on the uploadType selection
      ]
    };

    // Determine if we're editing or creating new 
    const isEditing = !!currentItem;

    switch (contentType) {
      case 'media':
        return [
          ...sharedFields.mediaFields,
          { 
            name: 'uploadType', 
            label: 'Upload Type', 
            type: 'custom-select',
            options: ['Upload File', 'Video Link'], 
            required: true,
            // Only show this for video types
            showIf: 'type',
            showIfValue: ['Documentary', 'Video Series']
          },
          { 
            name: 'videoLink', 
            label: 'Video Link', 
            type: 'text', 
            placeholder: 'Enter video URL (YouTube, Vimeo, or direct video link)',
            required: true,
            showIf: 'uploadType', 
            showIfValue: 'Video Link' 
          },
          { 
            name: 'mediafile', 
            label: isEditing ? 'Media File (only if changing)' : 'Media File', 
            type: 'file', 
            required: !isEditing,
            showIf: 'uploadType', 
            showIfValue: 'Upload File',
            hint: 'File size should be less than 10MB'
          },
          { name: 'thumbnail', label: 'Thumbnail Image (for videos)', type: 'file', required: false },
          { 
            name: 'galleryUrls', 
            label: 'Gallery Images URLs (comma separated)', 
            type: 'textarea', 
            placeholder: 'https://example.com/image1.jpg, https://example.com/image2.jpg', 
            required: false 
          },
          { name: 'category', label: 'Category', type: 'text', required: false },
          { name: 'uploadDate', label: 'Date', type: 'date', required: false },
        ];
      case 'programs':
        return [
          ...sharedFields.programFields,
          { 
            name: 'uploadType', 
            label: 'Upload Type', 
            type: 'custom-select',
            options: ['Upload File', 'Video Link'], 
            required: true,
            // Only show this for video types
            showIf: 'type',
            showIfValue: ['Documentary', 'Video Series']
          },
          { 
            name: 'videoLink', 
            label: 'Video Link', 
            type: 'text', 
            required: true,
            placeholder: 'Enter video URL (YouTube, Vimeo, or direct video link)',
            showIf: 'uploadType', 
            showIfValue: 'Video Link'
          },
          { 
            name: 'video', 
            label: isEditing ? 'Video File (only if changing)' : 'Video File', 
            type: 'file', 
            required: !isEditing,
            showIf: 'uploadType', 
            showIfValue: 'Upload File',
            hint: 'File size should be less than 10MB'
          },
          { 
            name: 'image', 
            label: isEditing ? 'Image (only if changing)' : 'Image', 
            type: 'file', 
            required: false, 
            hint: 'Upload an image file for this content (optional)'
          },
        ];
      case 'projects':
        return [
          ...sharedFields.projectFields,
          { 
            name: 'uploadType', 
            label: 'Upload Type', 
            type: 'custom-select',
            options: ['Upload File', 'Video Link'], 
            required: true,
            // Only show this for video types
            showIf: 'type',
            showIfValue: ['Documentary', 'Video Series']
          },
          { 
            name: 'videoLink', 
            label: 'Video Link', 
            type: 'text', 
            required: true,
            placeholder: 'Enter video URL (YouTube, Vimeo, or direct video link)',
            showIf: 'uploadType', 
            showIfValue: 'Video Link'
          },
          { 
            name: 'video', 
            label: isEditing ? 'Video File (only if changing)' : 'Video File', 
            type: 'file', 
            required: !isEditing,
            showIf: 'uploadType', 
            showIfValue: 'Upload File',
            hint: 'File size should be less than 10MB'
          },
          { 
            name: 'image', 
            label: isEditing ? 'Image (only if changing)' : 'Image', 
            type: 'file', 
            required: false, 
            hint: 'Upload an image file for this content (optional)'
          },
        ];
      case 'team':
        return [
          ...sharedFields.teamFields,
          { name: 'photo', label: isEditing ? 'Photo (only if changing)' : 'Photo', type: 'file', required: !isEditing },
        ];
      case 'information':
        return [
          ...sharedFields.informationFields,
          { 
            name: 'videoUrl', 
            label: 'Video URL', 
            type: 'text', 
            required: false,
            placeholder: 'Enter video URL (YouTube, Vimeo, or direct video link)',
            showIf: 'uploadType', 
            showIfValue: 'Video Link',
            hint: 'Paste a YouTube, Vimeo, or other video platform URL'
          },
          { 
            name: 'video', 
            label: isEditing ? 'Video File (only if changing)' : 'Video File', 
            type: 'file', 
            required: false,
            showIf: 'uploadType', 
            showIfValue: 'Upload File',
            hint: 'File size should be less than 10MB'
          },
          { 
            name: 'image', 
            label: isEditing ? 'Image (only if changing)' : 'Image', 
            type: 'file', 
            required: false, 
            hint: 'Upload an image file for this content (optional)'
          },
        ];
      default:
        return [];
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full';
    if (status === 'Published') return <span className={`${baseClasses} bg-green-100 text-green-800`}>Published</span>;
    if (status === 'Draft') return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Draft</span>;
    return null;
  };

  const renderGenericListItem = (item, imageUrlKey, titleKey) => {
    const formatDate = (date) => {
      if (!date) return null;
      try {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime()) ? formatDistanceToNow(dateObj, { addSuffix: true }) : null;
      } catch (error) {
        return null;
      }
    };
    
    // Format a full date for display
    const formatFullDate = (date) => {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return '';
      }
    };

    // Get the most recent date between updatedAt and createdAt
    const dateText = formatDate(item.updatedAt) || formatDate(item.createdAt) || formatDate(item.uploadDate) || 'Update date unavailable';

    // Choose what date to display based on content type
    let formattedDate = '';
    if (activeTab === 'programs') {
      // For programs, prefer to show startDate
      formattedDate = formatFullDate(item.startDate) || formatFullDate(item.createdAt);
    }
    else if (activeTab === 'projects') {
      // For projects, prefer to show expectedStartDate
      formattedDate = formatFullDate(item.expectedStartDate) || formatFullDate(item.createdAt);
    }
    else if (activeTab === 'information') {
      // For information items, show uploadDate
      formattedDate = formatFullDate(item.uploadDate) || formatFullDate(item.date) || formatFullDate(item.createdAt);
    }
    else {
      // For other types, show uploadDate if available
      formattedDate = item.uploadDate ? formatFullDate(item.uploadDate) : '';
    }

    // Determine the best image URL to use
    let imageUrl = item[imageUrlKey];

    // For videos, prefer thumbnail if available
    if (item.fileType === 'video') {
      imageUrl = item.thumbnailUrl || item.thumbnailPath || imageUrl;
    }

    return (
      <div key={item._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {imageUrl && <img src={imageUrl} alt={item[titleKey]} className="w-24 h-16 rounded object-cover" />}
          <div>
            {item && item.groupTitle && <p className="text-xs text-gray-400 mt-1">Group: {item.groupTitle}</p>}
            <h3 className="text-lg font-medium text-gray-900">{item[titleKey] || 'Untitled'}</h3>
            <p className="text-sm text-gray-500">
              <span className="inline-block mr-2">{formattedDate}</span> •
              <span className="inline-block ml-2 italic">{dateText}</span>
            </p>
            {item.fileType === 'video' && (
              <p className="text-xs text-gray-500 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Video {item.duration && `• ${item.duration}`}
                </span>
              </p>
            )}
            {(item.beneficiaries || item.programDuration) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {item.beneficiaries && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                    <Icon name="Users" size={12} className="mr-1" />
                    {item.beneficiaries} beneficiaries
                  </span>
                )}
                {item.programDuration && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {item.programDuration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Edit"
          >
            <Icon name="Edit" size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-2 rounded-md hover:bg-gray-100 text-red-500"
            title="Delete"
          >
            <Icon name="Trash2" size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderContentList = () => {
    if (loading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    const renderList = (items, renderItem, emptyMessage) => {
      if (!items || items.length === 0) {
        return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
      }
      return <div className="space-y-4">{items.filter(Boolean).map(renderItem)}</div>;
    };

    switch (activeTab) {
      case 'media':
        return renderList(mediaItems, item => renderGenericListItem(item, 'mediaUrl', 'title'), 'No media content available yet.');
      case 'programs':
        return renderList(programs, item => renderGenericListItem(item, 'coverImage', 'name'), 'No programs available yet.');
      case 'projects':
        return renderList(projects, item => renderGenericListItem(item, 'coverImage', 'name'), 'No projects available yet.');
      case 'team':
        return renderList(teamMembers, (member) => (
          <div key={member._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {member.role}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  {member.email && (
                    <span className="flex items-center">
                      <Icon name="Mail" size={12} className="mr-1" />
                      {member.email}
                    </span>
                  )}
                  {member.phone && (
                    <span className="flex items-center">
                      <Icon name="Phone" size={12} className="mr-1" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(member)}
                className="p-2 rounded-md hover:bg-gray-100"
                title="Edit"
              >
                <Icon name="Edit" size={16} />
              </button>
              <button
                onClick={() => handleDelete(member)}
                className="p-2 rounded-md hover:bg-gray-100 text-red-500"
                title="Delete"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        ), 'No team members available yet.');
      case 'information':
        return renderList(informationContent, item => renderGenericListItem(item, 'image', 'title'), 'No information content available yet.');
      default:
        return <div className="text-center py-12">Select a category to manage content.</div>;
    }
  };

  const modalTitle = currentItem
    ? `Edit ${contentSections.find(s => s.id === activeTab)?.title}`
    : `Add New ${contentSections.find(s => s.id === activeTab)?.title}`;

  // Add global loading indicator that shows during API requests
  const GlobalLoadingIndicator = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-green-100 overflow-hidden z-50">
        <div className="h-full bg-green-700 animate-loadingBar"></div>
      </div>
    );
  };

  // Simple notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="space-y-6 relative">
      <GlobalLoadingIndicator isVisible={loading} />

      {/* Notification Component */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
          notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'
        }`}>
          <div className="flex items-start">
            <Icon 
              name={notification.type === 'error' ? 'AlertCircle' : 'CheckCircle'} 
              size={20} 
              className={`mr-3 flex-shrink-0 ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`} 
            />
            <div className="flex-1">
              <p className={`font-medium ${notification.type === 'error' ? 'text-red-700' : 'text-green-700'}`}>
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contentSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all text-left ${activeTab === section.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={section.icon} size={20} className={activeTab === section.id ? 'text-green-700' : 'text-gray-500'} />
              <h3 className="font-medium text-gray-800">{section.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{section.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {contentSections.find((s) => s.id === activeTab)?.title}
          </h2>
          <p className="text-gray-500">
            {contentSections.find((s) => s.id === activeTab)?.description}
          </p>
        </div>
        <button
          className={`bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 flex items-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          onClick={handleAddNew}
          disabled={loading}
        >
          <Icon name="Plus" size={16} />
          <span>Add New</span>
        </button>
      </div>

      {renderContentList()}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="xl"
      >
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        <DynamicForm
          key={currentItem?._id || 'new'}
          fields={getFormConfig(activeTab)}
          initialData={currentItem}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${activeTab === 'media' ? 'media item' :
          activeTab === 'programs' ? 'program' :
            activeTab === 'projects' ? 'project' :
              activeTab === 'team' ? 'team member' : 'information item'
          }?`}
        isLoading={loading}
      />
    </div>
  );
};

export default ContentManagement;