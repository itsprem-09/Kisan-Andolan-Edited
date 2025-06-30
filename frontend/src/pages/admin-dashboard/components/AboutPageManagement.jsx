import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import aboutService from 'services/aboutService';
import DynamicForm from './DynamicForm';
import Modal from 'components/ui/Modal';
import ConfirmModal from './ConfirmModal';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const AboutPageManagement = () => {
  const [activeTab, setActiveTab] = useState('impact');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch about data on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await aboutService.getAboutContent();
        setAboutData(response.data);
      } catch (err) {
        console.error('Failed to fetch about page content:', err);
        setError('Failed to load about page content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Tabs for about page sections
  const tabs = [
    { id: 'impact', label: 'Impact Metrics', icon: 'BarChart2' },
    { id: 'info-boxes', label: 'Info Boxes', icon: 'MessageSquare' },
    { id: 'testimonials', label: 'Testimonials', icon: 'MessageCircle' },
    { id: 'community-stats', label: 'Community Stats', icon: 'PieChart' },
    { id: 'partners', label: 'Partners', icon: 'Users' }
  ];

  // Handle edit item
  const handleEdit = (item, section) => {
    setCurrentItem(item);
    setCurrentSection(section);
    setIsModalOpen(true);
  };

  // Handle delete item
  const handleDelete = (item, section) => {
    setItemToDelete({ item, section });
    setIsDeleteModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setCurrentSection(null);
  };

  // Handle close delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Get form config based on section
  const getFormConfig = (section) => {
    switch (section) {
      case 'impact':
        // Create fallback values for impact metrics when aboutData is null or fields are missing
        const impactMetrics = aboutData?.impactMetrics || {};
        return {
          title: 'Edit Impact Metrics',
          fields: [
            {
              name: 'farmers',
              label: 'Farmers Reached',
              type: 'number',
              defaultValue: impactMetrics.farmers || 100000,
              placeholder: 'Enter number of farmers'
            },
            {
              name: 'villages',
              label: 'Villages Covered',
              type: 'number',
              defaultValue: impactMetrics.villages || 1250,
              placeholder: 'Enter number of villages'
            },
            {
              name: 'programs',
              label: 'Programs Implemented',
              type: 'number',
              defaultValue: impactMetrics.programs || 45,
              placeholder: 'Enter number of programs'
            },
            {
              name: 'states',
              label: 'States Active',
              type: 'number',
              defaultValue: impactMetrics.states || 18,
              placeholder: 'Enter number of states'
            }
          ]
        };
      
      case 'info-boxes':
        return {
          title: currentItem ? 'Edit Info Box' : 'Add Info Box',
          fields: [
            {
              name: 'title',
              label: 'Title (English)',
              type: 'text',
              defaultValue: currentItem?.title || '',
              placeholder: 'Enter info box title'
            },
            {
              name: 'hindi_title',
              label: 'Title (Hindi)',
              type: 'text',
              defaultValue: currentItem?.hindi_title || '',
              placeholder: 'Enter info box title in Hindi'
            },
            {
              name: 'description',
              label: 'Description (English)',
              type: 'textarea',
              defaultValue: currentItem?.description || '',
              placeholder: 'Enter info box description'
            },
            {
              name: 'hindi_description',
              label: 'Description (Hindi)',
              type: 'textarea',
              defaultValue: currentItem?.hindi_description || '',
              placeholder: 'Enter info box description in Hindi'
            },
            {
              name: 'icon',
              label: 'Icon',
              type: 'select',
              defaultValue: currentItem?.icon || 'TrendingUp',
              options: [
                { value: 'TrendingUp', label: 'Trending Up' },
                { value: 'Award', label: 'Award' },
                { value: 'Globe', label: 'Globe' },
                { value: 'Target', label: 'Target' },
                { value: 'Zap', label: 'Zap' },
                { value: 'Heart', label: 'Heart' }
              ]
            }
          ]
        };
        
      case 'testimonials':
        return {
          title: currentItem ? 'Edit Testimonial' : 'Add Testimonial',
          fields: [
            {
              name: 'quote',
              label: 'Quote (English)',
              type: 'textarea',
              defaultValue: currentItem?.quote || '',
              placeholder: 'Enter testimonial quote'
            },
            {
              name: 'hindi_quote',
              label: 'Quote (Hindi)',
              type: 'textarea',
              defaultValue: currentItem?.hindi_quote || '',
              placeholder: 'Enter testimonial quote in Hindi'
            },
            {
              name: 'author',
              label: 'Author Name (English)',
              type: 'text',
              defaultValue: currentItem?.author || '',
              placeholder: 'Enter author name'
            },
            {
              name: 'hindi_author',
              label: 'Author Name (Hindi)',
              type: 'text',
              defaultValue: currentItem?.hindi_author || '',
              placeholder: 'Enter author name in Hindi'
            },
            {
              name: 'role',
              label: 'Role/Position (English)',
              type: 'text',
              defaultValue: currentItem?.role || '',
              placeholder: 'Enter author role or position'
            },
            {
              name: 'hindi_role',
              label: 'Role/Position (Hindi)',
              type: 'text',
              defaultValue: currentItem?.hindi_role || '',
              placeholder: 'Enter author role or position in Hindi'
            },
            {
              name: 'impact',
              label: 'Impact Highlight (English)',
              type: 'text',
              defaultValue: currentItem?.impact || '',
              placeholder: 'Enter impact highlight (e.g. "40% increase in crop yields")'
            },
            {
              name: 'hindi_impact',
              label: 'Impact Highlight (Hindi)',
              type: 'text',
              defaultValue: currentItem?.hindi_impact || '',
              placeholder: 'Enter impact highlight in Hindi'
            },
            {
              name: 'image',
              label: 'Author Image',
              type: 'file',
              accept: 'image/*',
              defaultValue: currentItem?.image || '',
              existingImageUrl: currentItem?.image || '',
              hint: currentItem?.image ? 'Only upload a new image if you want to replace the existing one' : 'Upload author image',
              isRequired: !currentItem,
              placeholder: 'Upload author image'
            }
          ]
        };
        
      case 'community-stats':
        return {
          title: 'Edit Community Stats',
          fields: [
            {
              name: 'successStories',
              label: 'Success Stories',
              type: 'number',
              defaultValue: aboutData?.communityStats?.successStories || 0,
              placeholder: 'Enter number of success stories'
            },
            {
              name: 'satisfactionRate',
              label: 'Satisfaction Rate (%)',
              type: 'number',
              defaultValue: aboutData?.communityStats?.satisfactionRate || 0,
              placeholder: 'Enter satisfaction rate percentage'
            },
            {
              name: 'incomeIncrease',
              label: 'Income Increase (%)',
              type: 'number',
              defaultValue: aboutData?.communityStats?.incomeIncrease || 0,
              placeholder: 'Enter average income increase percentage'
            }
          ]
        };
        
      case 'partners':
        // Ensure partners are properly formatted as one per line
        let partnersDefaultValue = '';
        if (currentItem?.partners) {
          // Make sure partners are always an array before joining
          const partnersArray = Array.isArray(currentItem.partners) 
            ? currentItem.partners 
            : typeof currentItem.partners === 'string'
              ? currentItem.partners.split(',')  // Handle comma-separated string
              : []; // Fallback for unexpected data types
          
          // Clean up any whitespace from potential comma formatting
          partnersDefaultValue = partnersArray
            .map(partner => partner.trim())
            .filter(partner => partner) // Remove any empty strings
            .join('\n');
          
          console.log('Partners formatted for form:', partnersDefaultValue);
        }
        
        return {
          title: currentItem ? 'Edit Partner Category' : 'Add Partner Category',
          fields: [
            {
              name: 'category',
              label: 'Category Name (English)',
              type: 'text',
              defaultValue: currentItem?.category || '',
              placeholder: 'Enter partner category name'
            },
            {
              name: 'hindi_category',
              label: 'Category Name (Hindi)',
              type: 'text',
              defaultValue: currentItem?.hindi_category || '',
              placeholder: 'Enter partner category name in Hindi'
            },
            {
              name: 'icon',
              label: 'Icon',
              type: 'select',
              defaultValue: currentItem?.icon || 'Building',
              options: [
                { value: 'Building', label: 'Building' },
                { value: 'Landmark', label: 'Landmark' },
                { value: 'Globe', label: 'Globe' },
                { value: 'Globe2', label: 'Globe Alt' },
                { value: 'GraduationCap', label: 'Graduation Cap' },
                { value: 'Book', label: 'Book' }
              ]
            },
            {
              name: 'partners',
              label: 'Partners (one per line)',
              type: 'textarea',
              defaultValue: partnersDefaultValue,
              placeholder: 'Enter partners (one per line)'
            }
          ]
        };
        
      default:
        return { title: '', fields: [] };
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    console.log('Form data submitted:', formData);
    console.log('Current section:', currentSection);
    
    try {
      let response;
      
      switch (currentSection) {
        case 'impact':
          // Extract the data from FormData if it's a FormData object
          let impactMetricsData;
          try {
            if (formData instanceof FormData) {
              console.log('FormData received for impact metrics:', formData);
              impactMetricsData = {
                farmers: Number(formData.get('farmers')) || 100000,
                villages: Number(formData.get('villages')) || 1250,
                programs: Number(formData.get('programs')) || 45,
                states: Number(formData.get('states')) || 18
              };
            } else {
              // Make sure we convert the form values to numbers
              impactMetricsData = {
                farmers: Number(formData.farmers) || 100000,
                villages: Number(formData.villages) || 1250,
                programs: Number(formData.programs) || 45,
                states: Number(formData.states) || 18
              };
            }
            
            console.log('Submitting impact metrics data:', impactMetricsData);
            response = await aboutService.updateImpactMetrics(impactMetricsData);
            console.log('Impact metrics update response:', response);
            
            // Update local state
            setAboutData(prevState => ({
              ...prevState,
              impactMetrics: response.data
            }));
          } catch (err) {
            console.error('Error updating impact metrics:', err);
            setError(`Failed to update impact metrics: ${err.message || 'Unknown error'}`);
            throw err; // Rethrow to prevent modal from closing
          }
          break;
          
        case 'info-boxes':
          // Process the form data
          const newInfoBox = {};
          
          if (formData instanceof FormData) {
            // Extract data from FormData
            newInfoBox.title = formData.get('title') || '';
            newInfoBox.hindi_title = formData.get('hindi_title') || '';
            newInfoBox.description = formData.get('description') || '';
            newInfoBox.hindi_description = formData.get('hindi_description') || '';
            newInfoBox.icon = formData.get('icon') || 'TrendingUp';
          } else {
            // Regular object
            newInfoBox.title = formData.title || '';
            newInfoBox.hindi_title = formData.hindi_title || '';
            newInfoBox.description = formData.description || '';
            newInfoBox.hindi_description = formData.hindi_description || '';
            newInfoBox.icon = formData.icon || 'TrendingUp';
          }
          
          console.log('Processed info box data:', newInfoBox);
          
          // If editing, update the existing info box
          let updatedInfoBoxes;
          if (currentItem) {
            // Use _id for comparison when available, otherwise use index matching
            updatedInfoBoxes = aboutData.infoBoxes.map(box => 
              (box._id && box._id === currentItem._id) || box === currentItem ? 
                { ...box, ...newInfoBox } : box
            );
          } else {
            // If adding new, append to array
            updatedInfoBoxes = [...aboutData.infoBoxes, newInfoBox];
          }
          
          console.log('Updated info boxes:', updatedInfoBoxes);
          
          response = await aboutService.updateInfoBoxes(updatedInfoBoxes);
          
          // Update local state
          setAboutData(prevState => ({
            ...prevState,
            infoBoxes: response.data
          }));
          break;
          
        case 'testimonials':
          try {
            // Set loading state right away
            setLoading(true);
            setError(null);
            
            // Create FormData for file upload
            const testimonialFormData = new FormData();
            
            // Get current testimonials
            const testimonials = [...aboutData.testimonials];
            
            // Extract testimonial data from form
            const testimonialData = {
              quote: '',
              hindi_quote: '',
              author: '',
              hindi_author: '',
              role: '',
              hindi_role: '',
              impact: '',
              hindi_impact: '',
              image: ''
            };
            
            // Check if we're getting FormData or regular object
            if (formData instanceof FormData) {
              // Extract data from FormData
              testimonialData.quote = formData.get('quote') || '';
              testimonialData.hindi_quote = formData.get('hindi_quote') || '';
              testimonialData.author = formData.get('author') || '';
              testimonialData.hindi_author = formData.get('hindi_author') || '';
              testimonialData.role = formData.get('role') || '';
              testimonialData.hindi_role = formData.get('hindi_role') || '';
              testimonialData.impact = formData.get('impact') || '';
              testimonialData.hindi_impact = formData.get('hindi_impact') || '';
              
              // Handle image upload
              const imageFile = formData.get('image');
              if (imageFile instanceof File && imageFile.size > 0) {
                // Add image file to FormData for upload
                testimonialFormData.append('image', imageFile);
              } else if (currentItem?.image) {
                // Keep existing image if no new one is provided
                testimonialData.image = currentItem.image;
              }
              
              // Add all other testimonial data to the FormData
              Object.entries(testimonialData).forEach(([key, value]) => {
                if (value) testimonialFormData.append(key, value);
              });
              
            } else {
              // Extract data from regular object
              testimonialData.quote = formData.quote || '';
              testimonialData.hindi_quote = formData.hindi_quote || '';
              testimonialData.author = formData.author || '';
              testimonialData.hindi_author = formData.hindi_author || '';
              testimonialData.role = formData.role || '';
              testimonialData.hindi_role = formData.hindi_role || '';
              testimonialData.impact = formData.impact || '';
              testimonialData.hindi_impact = formData.hindi_impact || '';
              testimonialData.image = formData.image || currentItem?.image || '';
              
              // Add all testimonial data to the FormData
              Object.entries(testimonialData).forEach(([key, value]) => {
                if (value) testimonialFormData.append(key, value);
              });
            }
            
            // Add _id if editing existing testimonial
            if (currentItem?._id) {
              testimonialFormData.append('_id', currentItem._id);
            }
            
            // Prepare testimonials array
            let updatedTestimonials;
            if (currentItem) {
              // Update existing testimonial
              updatedTestimonials = testimonials.map(item => {
                if ((item._id && item._id === currentItem._id) || item === currentItem) {
                  return { ...item, ...testimonialData };
                }
                return item;
              });
            } else {
              // Add new testimonial
              updatedTestimonials = [...testimonials, testimonialData];
            }
            
            // Add the full testimonials array to the FormData
            testimonialFormData.append('testimonials', JSON.stringify(updatedTestimonials));
            
            console.log('Sending testimonial data:', updatedTestimonials);
            
            // Make API request
            response = await aboutService.updateTestimonials(testimonialFormData);
            console.log('Testimonial update response:', response);
            
            // Update local state
            setAboutData(prevState => ({
              ...prevState,
              testimonials: response.data
            }));
            
            // Close the modal after successful update
            handleCloseModal();
          } catch (err) {
            console.error('Error in testimonial form handling:', err);
            setError(`Error processing testimonial: ${err.message || 'Unknown error'}`);
            setLoading(false);
          }
          return; // Return early to avoid the finally block outside the switch
          break;
          
        case 'community-stats':
          try {
            // Extract the data from FormData if it's a FormData object
            let communityStatsData;
            if (formData instanceof FormData) {
              communityStatsData = {
                successStories: Number(formData.get('successStories')) || 0,
                satisfactionRate: Number(formData.get('satisfactionRate')) || 0,
                incomeIncrease: Number(formData.get('incomeIncrease')) || 0
              };
            } else {
              communityStatsData = {
                successStories: Number(formData.successStories) || 0,
                satisfactionRate: Number(formData.satisfactionRate) || 0,
                incomeIncrease: Number(formData.incomeIncrease) || 0
              };
            }
            
            console.log('Submitting community stats data:', communityStatsData);
            response = await aboutService.updateCommunityStats(communityStatsData);
            console.log('Community stats update response:', response);
            
            // Update local state if response has valid data
            if (response && response.data) {
              setAboutData(prevState => ({
                ...prevState,
                communityStats: response.data
              }));
            } else {
              console.error('Community stats response missing data property');
              setError('Invalid response format from server');
            }
          } catch (err) {
            console.error('Error updating community stats:', err);
            setError(`Failed to update community stats: ${err.message || 'Unknown error'}`);
            throw err; // Rethrow to prevent modal from closing
          }
          break;
          
        case 'partners':
          try {
            // Process partner data
            let partnerCategory = {};
            
            if (formData instanceof FormData) {
              // Extract category data from FormData
              partnerCategory.category = formData.get('category') || '';
              partnerCategory.hindi_category = formData.get('hindi_category') || '';
              partnerCategory.icon = formData.get('icon') || 'Building';
              
              // Process partners text as an array (one per line)
              const partnersText = formData.get('partners') || '';
              partnerCategory.partners = partnersText
                .split('\n')
                .map(p => p.trim())
                .filter(p => p);
            } else {
              // Extract from regular object
              partnerCategory.category = formData.category || '';
              partnerCategory.hindi_category = formData.hindi_category || '';
              partnerCategory.icon = formData.icon || 'Building';
              
              // Process partners text as an array (one per line)
              const partnersText = formData.partners || '';
              partnerCategory.partners = partnersText
                .split('\n')
                .map(p => p.trim())
                .filter(p => p);
            }
            
            console.log('Processed partner category:', partnerCategory);
            
            // Get current partner categories
            const partnerCategories = [...(aboutData.partnerCategories || [])];
            
            // Update or add partner category
            let updatedPartnerCategories;
            if (currentItem) {
              // Update existing category
              updatedPartnerCategories = partnerCategories.map(cat => 
                (cat._id && cat._id === currentItem._id) || cat === currentItem ? 
                  { ...cat, ...partnerCategory } : cat
              );
            } else {
              // Add new category
              updatedPartnerCategories = [...partnerCategories, partnerCategory];
            }
            
            console.log('Updating partner categories:', updatedPartnerCategories);
            
            // Make API request
            response = await aboutService.updatePartners(updatedPartnerCategories);
            
            // Update local state
            setAboutData(prevState => ({
              ...prevState,
              partnerCategories: response.data
            }));

            // Close the modal after successful update
            handleCloseModal();
          } catch (err) {
            console.error('Error processing partner data:', err);
            setError(`Error processing partner data: ${err.message}`);
            partnerCategory.partners = [];
          }
          break;
          
        default:
          throw new Error('Invalid section for update');
      }
      
    } catch (err) {
      console.error(`Failed to update ${currentSection}:`, err);
      setError(`Failed to update ${currentSection}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    setError(null);
    
    const { item, section } = itemToDelete;
    
    try {
      let response;
      
      switch (section) {
        case 'info-boxes':
          // Filter out the item to delete
          const updatedInfoBoxes = aboutData.infoBoxes.filter(box => box !== item);
          response = await aboutService.updateInfoBoxes(updatedInfoBoxes);
          
          // Update local state
          setAboutData(prevState => ({
            ...prevState,
            infoBoxes: response.data
          }));
          break;
          
        case 'testimonials':
          // Filter out the item to delete
          const updatedTestimonials = aboutData.testimonials.filter(t => t !== item);
          
          const testimonialFormData = new FormData();
          testimonialFormData.append('testimonials', JSON.stringify(updatedTestimonials));
          
          response = await aboutService.updateTestimonials(testimonialFormData);
          
          // Update local state
          setAboutData(prevState => ({
            ...prevState,
            testimonials: response.data
          }));
          break;
          
        case 'partners':
          // Filter out the item to delete
          const updatedPartnerCategories = aboutData.partnerCategories.filter(cat => cat !== item);
          response = await aboutService.updatePartners(updatedPartnerCategories);
          
          // Update local state
          setAboutData(prevState => ({
            ...prevState,
            partnerCategories: response.data
          }));
          break;
          
        default:
          throw new Error('Invalid section for delete operation');
      }
      
      // Close the delete modal
      handleCloseDeleteModal();
      
    } catch (err) {
      console.error(`Failed to delete ${section}:`, err);
      setError(`Failed to delete ${section}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !aboutData) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Error state
  if (error && !aboutData) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <Icon name="AlertCircle" size={40} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load content</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render content for Impact Metrics tab
  const renderImpactMetricsTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Impact Metrics</h3>
        <button
          onClick={() => {
            setCurrentItem(null);
            setCurrentSection('impact');
            console.log('Opening Edit Metrics modal with section:', 'impact');
            console.log('Current aboutData:', aboutData);
            console.log('Current impactMetrics:', aboutData?.impactMetrics);
            console.log('Form config:', getFormConfig('impact'));
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Edit" size={16} />
          <span>Edit Metrics</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg p-4 text-center">
          <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.impactMetrics?.farmers?.toLocaleString()}+
          </div>
          <p className="text-text-secondary text-sm">Farmers Reached</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 text-center">
          <Icon name="Home" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.impactMetrics?.villages?.toLocaleString()}+
          </div>
          <p className="text-text-secondary text-sm">Villages Covered</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 text-center">
          <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.impactMetrics?.programs?.toLocaleString()}
          </div>
          <p className="text-text-secondary text-sm">Programs Implemented</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 text-center">
          <Icon name="Map" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.impactMetrics?.states?.toLocaleString()}
          </div>
          <p className="text-text-secondary text-sm">States Active</p>
        </div>
      </div>
    </div>
  );

  // Render content for Info Boxes tab
  const renderInfoBoxesTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Information Boxes</h3>
        <button
          onClick={() => {
            setCurrentItem(null);
            setCurrentSection('info-boxes');
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>Add Info Box</span>
        </button>
      </div>
      
      {aboutData?.infoBoxes?.length > 0 ? (
        <div className="space-y-4">
          {aboutData.infoBoxes.map((box, index) => (
            <div key={index} className="bg-surface rounded-lg p-4 flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Icon name={box.icon} size={20} className="text-primary" />
              </div>
              
              <div className="flex-grow">
                <h4 className="text-primary font-medium mb-1">{box.title}</h4>
                <p className="text-text-secondary text-sm">{box.description}</p>
              </div>
              
              <div className="flex-shrink-0 space-x-2">
                <button
                  onClick={() => handleEdit(box, 'info-boxes')}
                  className="p-2 text-primary hover:bg-accent rounded-full"
                >
                  <Icon name="Edit" size={16} />
                </button>
                
                <button
                  onClick={() => handleDelete(box, 'info-boxes')}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Icon name="Trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-surface rounded-lg">
          <Icon name="FileX" size={40} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No information boxes added yet</p>
        </div>
      )}
    </div>
  );

  // Render content for Testimonials tab
  const renderTestimonialsTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Testimonials</h3>
        <button
          onClick={() => {
            setCurrentItem(null);
            setCurrentSection('testimonials');
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>
      
      {aboutData?.testimonials?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutData.testimonials.map((testimonial, index) => (
            <div key={index} className="bg-surface rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="User" size={40} className="text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm opacity-90">{testimonial.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-text-secondary italic mb-3">"{testimonial.quote.length > 150 ? testimonial.quote.substring(0, 150) + '...' : testimonial.quote}"</p>
                <div className="bg-accent bg-opacity-20 px-3 py-1 rounded-full inline-block">
                  <span className="text-xs font-medium text-primary">{testimonial.impact}</span>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial, 'testimonials')}
                    className="p-2 text-primary hover:bg-accent rounded-full"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(testimonial, 'testimonials')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Icon name="Trash" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-surface rounded-lg">
          <Icon name="MessageCircleOff" size={40} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No testimonials added yet</p>
        </div>
      )}
    </div>
  );

  // Render content for Community Stats tab
  const renderCommunityStatsTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Community Voice Stats</h3>
        <button
          onClick={() => {
            setCurrentItem(null);
            setCurrentSection('community-stats');
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Edit" size={16} />
          <span>Edit Stats</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.communityStats?.successStories?.toLocaleString()}+
          </div>
          <p className="text-text-secondary text-sm">Success stories collected</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Star" size={24} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.communityStats?.satisfactionRate}%
          </div>
          <p className="text-text-secondary text-sm">Program satisfaction rate</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="TrendingUp" size={24} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {aboutData?.communityStats?.incomeIncrease}%
          </div>
          <p className="text-text-secondary text-sm">Average income increase</p>
        </div>
      </div>
    </div>
  );

  // Render content for Partners tab
  const renderPartnersTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Partner Categories</h3>
        <button
          onClick={() => {
            setCurrentItem(null);
            setCurrentSection('partners');
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>Add Partner Category</span>
        </button>
      </div>
      
      {aboutData?.partnerCategories?.length > 0 ? (
        <div className="space-y-6">
          {aboutData.partnerCategories.map((category, index) => (
            <div key={index} className="bg-surface rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <Icon name={category.icon} size={20} className="text-primary" />
                  </div>
                  <h4 className="text-primary font-medium">{category.category}</h4>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category, 'partners')}
                    className="p-2 text-primary hover:bg-accent rounded-full"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(category, 'partners')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Icon name="Trash" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pl-14">
                {category.partners.map((partner, i) => (
                  <div key={i} className="text-text-secondary text-sm flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    <span>{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-surface rounded-lg">
          <Icon name="Users" size={40} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No partner categories added yet</p>
        </div>
      )}
    </div>
  );

  // Render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'impact':
        return renderImpactMetricsTab();
      case 'info-boxes':
        return renderInfoBoxesTab();
      case 'testimonials':
        return renderTestimonialsTab();
      case 'community-stats':
        return renderCommunityStatsTab();
      case 'partners':
        return renderPartnersTab();
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">About Page Management</h2>
      
      {/* Section Tabs */}
      <div className="mb-8">
        <div className="border-b border-border">
          <nav className="flex flex-wrap space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Active Tab Content */}
      {renderActiveTabContent()}
      
      {/* Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={getFormConfig(currentSection).title}
          size="lg"
        >
          {console.log('Rendering DynamicForm with fields:', getFormConfig(currentSection).fields)}
          <DynamicForm
            fields={getFormConfig(currentSection).fields}
            initialData={currentSection === 'impact' ? aboutData?.impactMetrics : 
                       currentSection === 'community-stats' ? aboutData?.communityStats :
                       currentItem}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            isLoading={loading}
            error={error}
          />
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this item? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          loading={loading}
        />
      )}
    </div>
  );
};

export default AboutPageManagement; 