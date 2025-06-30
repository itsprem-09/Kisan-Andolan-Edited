import React, { useState, useEffect } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import informationService from 'services/informationService';
import Image from 'components/AppImage';
import ContentCard from './components/ContentCard';
import ContentModal from '../our-vision-mission-page/components/ContentModal';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useLanguage } from 'contexts/LanguageContext';

const InformationCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [regionFilter, setRegionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flattenedInformation, setFlattenedInformation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getTranslation } = useLanguage();

  const sections = [
    { title: getTranslation('governmentSchemes'), group: "governmentSchemes" },
    { title: getTranslation('agriculturalResources'), group: "agriculturalResources" },
    { title: getTranslation('educationalMaterials'), group: "educationalMaterials" },
    { title: getTranslation('newsAndUpdates'), group: "newsUpdates" },
  ];


  useEffect(() => {
    const fetchInformation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await informationService.getInformationItems();
        const groups = response?.data?.data || [];
        
        const flatList = [];

        groups.forEach(group => {
          // Ensure group has a valid groupTitle and items array
          const groupTitle = group.groupTitle || 'Uncategorized';
          const items = Array.isArray(group.items) ? group.items : [];
          
          // Add default values to each item
          const itemsWithGroupTitle = items.map(item => ({
            _id: item._id || `item-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || 'Untitled',
            description: item.description || '',
            category: item.category || 'general',
            ...item,
            groupTitle: groupTitle,
          }));

          flatList.push(...itemsWithGroupTitle);
        });

        setFlattenedInformation(flatList);
      } catch (err) {
        console.error('Failed to fetch information items:', err);
        setError('Unable to load information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, []);

  console.log("ITEM:" + flattenedInformation);
  

  // Filter and search functionality
  const filterContent = (content) => {
    return content.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Region filter
      if (regionFilter !== 'all' && item.region !== regionFilter && item.region !== 'all') {
        return false;
      }

      // Search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  // Helper function to safely get a valid date from an item
  const safeDate = (item) => {
    // Try different date fields in order of preference
    const possibleDates = [
      item.date,
      item.createdAt,
      item.uploadDate,
      item.publishedAt,
      item.updatedAt
    ];
    
    // Find the first valid date
    for (const dateString of possibleDates) {
      if (dateString) {
        try {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    // If we have a numeric timestamp
    if (typeof item.timestamp === 'number') {
      return new Date(item.timestamp);
    }
    
    // Default to epoch start for items with no valid date
    return new Date(0);
  };

  const sortContent = (content) => {
    switch (sortBy) {
      case 'date':
        return [...content].sort((a, b) => {
          const dateA = safeDate(a);
          const dateB = safeDate(b);
          return dateB - dateA; // Sort in descending order (newest first)
        });
      case 'engagement':
        return [...content].sort((a, b) => (b.engagementMetric || 0) - (a.engagementMetric || 0));
      default: // 'relevance' - we'll assume default order is by relevance
        return content;
    }
  };

  const filteredAndSorted = sortContent(filterContent(flattenedInformation));

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const toggleBookmark = (resourceId) => {
    if (!resourceId) return; // Skip if no valid ID
    
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter(id => id !== resourceId));
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId]);
    }
  };

  const handleCardClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb customItems={[
          { label: getTranslation('home'), path: '/homepage', isActive: false },
          { label: getTranslation('informationCenter'), path: '/information-center-page', isActive: true }
        ]} />

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Icon name="Library" size={32} color="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            {getTranslation('informationCenterTitle')}
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {getTranslation('informationCenterDesc')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-surface rounded-xl p-6 shadow-md mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label htmlFor="search" className="form-label">{getTranslation('searchResources')}</label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getTranslation('searchPlaceholder')}
                    className="form-input pl-10 pr-4 py-3 w-full"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Search" size={18} className="text-text-secondary" />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <label htmlFor="category" className="form-label">{getTranslation('category')}</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="all">{getTranslation('allCategories')}</option>
                  <option value="subsidy">{getTranslation('subsidies')}</option>
                  <option value="certification">{getTranslation('certification')}</option>
                  <option value="insurance">{getTranslation('insurance')}</option>
                  <option value="seasonal">{getTranslation('seasonal')}</option>
                  <option value="sustainable">{getTranslation('sustainable')}</option>
                  <option value="weather">{getTranslation('weather')}</option>
                  <option value="pdf">{getTranslation('pdfGuides')}</option>
                  <option value="video">{getTranslation('videos')}</option>
                  <option value="infographic">{getTranslation('infographics')}</option>
                  <option value="policy">{getTranslation('policy')}</option>
                  <option value="market">{getTranslation('market')}</option>
                  <option value="event">{getTranslation('events')}</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="w-full md:w-48">
                <label htmlFor="region" className="form-label">{getTranslation('region')}</label>
                <select
                  id="region"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">{getTranslation('allRegions')}</option>
                  <option value="national">{getTranslation('national')}</option>
                  <option value="north">{getTranslation('northIndia')}</option>
                  <option value="south">{getTranslation('southIndia')}</option>
                  <option value="east">{getTranslation('eastIndia')}</option>
                  <option value="west">{getTranslation('westIndia')}</option>
                  <option value="central">{getTranslation('centralIndia')}</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="w-full md:w-48">
                <label htmlFor="sortBy" className="form-label">{getTranslation('sortBy')}</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input"
                >
                  <option value="relevance">{getTranslation('relevance')}</option>
                  <option value="date">{getTranslation('date')}</option>
                  <option value="engagement">{getTranslation('engagement')}</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto">
                <button 
                  type="submit" 
                  className="btn-primary w-full md:w-auto flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin mr-2">
                      <Icon name="Loader" size={20} />
                    </span>
                  ) : (
                    <Icon name="Search" size={20} className="mr-2" />
                  )}
                  {getTranslation('search')}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Content Sections */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin">
              <Icon name="Loader" size={40} className="text-primary" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-error">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary mt-4">
              <Icon name="RefreshCw" size={18} className="mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Quick Access Buttons */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-primary mb-6">{getTranslation('quickLinks')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sections.map((section) => (
                  <button
                    key={section.group}
                    className="bg-surface hover:bg-surface-hover text-primary p-4 rounded-xl text-center transition-colors flex flex-col items-center justify-center h-28"
                    onClick={() => {
                      const element = document.getElementById(section.group);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Icon name={getSectionIcon(section.group)} size={32} className="mb-2" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Dynamic Content Section */}
            {sections.map((section) => (
              <div key={section.group} id={section.group} className="mb-16">
                <h2 className="text-2xl font-heading font-semibold text-primary mb-6">{section.title}</h2>
                <div>
                  <CarouselSection
                    items={getItemsByGroup(filteredAndSorted, section.group)}
                    onCardClick={handleCardClick}
                    toggleBookmark={toggleBookmark}
                    bookmarkedResources={bookmarkedResources}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Content Modal */}
      <ContentModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        content={modalContent}
      />
    </div>
  );
};

// Helper function to map group names to Icon components
const getSectionIcon = (group) => {
  switch (group) {
    case 'governmentSchemes':
      return 'FileText';
    case 'agriculturalResources':
      return 'Sprout';
    case 'educationalMaterials':
      return 'BookOpen';
    case 'newsUpdates':
      return 'Newspaper';
    default:
      return 'Info';
  }
};

// Helper function to get items by group name
const getItemsByGroup = (items, groupName) => {
  return items.filter(item => {
    // Check various possible properties that might indicate group membership
    if (item.group === groupName) return true;
    if (item.groupTitle && item.groupTitle.toLowerCase().includes(groupName.toLowerCase())) return true;
    if (item.type && item.type.toLowerCase().includes(groupName.toLowerCase())) return true;
    if (item.category && item.category.toLowerCase().includes(groupName.toLowerCase())) return true;
    
    return false;
  });
};

// Carousel Section Component
const CarouselSection = ({ items, onCardClick, toggleBookmark, bookmarkedResources }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1920 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1920, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1
    }
  };
  
  const { getTranslation } = useLanguage();

  // Handle card click properly
  const handleCardClick = (item) => {
    if (onCardClick && typeof onCardClick === 'function') {
      onCardClick(item);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <Icon name="DatabaseX" size={48} className="mx-auto text-text-secondary mb-4" />
        <p className="text-text-secondary">{getTranslation('noContent')}</p>
      </div>
    );
  }

  return (
    <Carousel 
      responsive={responsive}
      infinite={items.length > 3}
      keyBoardControl={true}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["mobile"]}
      itemClass="px-2 pb-4"
    >
      {items.map((item, index) => (
        <ContentCard 
          key={item._id || index}
          item={item}
          onCardClick={handleCardClick}
          toggleBookmark={toggleBookmark}
          bookmarkedResources={bookmarkedResources || []}
        />
      ))}
    </Carousel>
  );
};

export default InformationCenterPage;