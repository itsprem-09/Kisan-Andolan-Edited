import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import mediaService from 'services/mediaService';
import programService from 'services/programService';
import projectService from 'services/projectService';
import Modal from 'components/ui/Modal';
import TranslateText from 'components/TranslateText';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import { useLanguage } from '../../../contexts/LanguageContext';

const OurVisionSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('media');
  const { language, getTranslation } = useLanguage();
  const [expandedView, setExpandedView] = useState(null);
  const [clickCount, setClickCount] = useState({});
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mediaItems, setMediaItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the database
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [mediaRes, programsRes, projectsRes] = await Promise.all([
          mediaService.getMediaItems(), // Remove category filter to get all media items
          programService.getPrograms(),
          projectService.getProjects(),
        ]);

        console.log('Media response:', mediaRes);
        setMediaItems(mediaRes.data || []);
        setPrograms(programsRes.data || []);
        setProjects(projectsRes.data || []);


      } catch (err) {
        console.error("Error fetching data for Our Vision section:", err);
        setError("Failed to load data. Please try again later.");
        // Clear data on error to avoid showing stale info
        setMediaItems([]);
        setPrograms([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fisher-Yates shuffle algorithm to randomize array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTabClick = (tab) => {
    const currentCount = clickCount[tab] || 0;
    const newCount = currentCount + 1;

    setClickCount({ ...clickCount, [tab]: newCount });
    setActiveTab(tab);
  };

  const closeExpandedView = () => {
    setExpandedView(null);
    setClickCount({});
  };

  // Handle navigation to our-vision-mission-page
  const navigateToVisionPage = () => {
    navigate(`/our-vision-mission-page`);
  };

  const getActiveTabData = () => {
    switch (activeTab) {
      case 'media':
        return mediaItems.length > 0 ? mediaItems : []; // Show only the first 3 items
      case 'programs':
        return programs.length > 0 ? programs : [];
      case 'projects':
        return projects.length > 0 ? projects : [];
      default:
        return [];
    }
  };

  // Static content translations
  const content = {
    en: {
      title: "Our Vision",
      subtitle: "Building a sustainable future for agriculture and rural communities",
      tabs: {
        media: "Media",
        programs: "Programs",
        projects: "Projects"
      },
      tabContent: {
        media: {
          title: "Media Coverage"
        },
        programs: {
          title: "Current Programs"
        },
        projects: {
          title: "Projects"
        }
      },
      loadingText: "Loading content...",
      errorText: "Failed to load content. Please try again later.",
      noItemsText: "No items available at the moment."
    },
    hi: {
      title: "हमारा दृष्टिकोण",
      subtitle: "कृषि और ग्रामीण समुदायों के लिए एक स्थायी भविष्य का निर्माण",
      tabs: {
        media: "मीडिया",
        programs: "कार्यक्रम",
        projects: "परियोजनाएं"
      },
      tabContent: {
        media: {
          title: "मीडिया कवरेज"
        },
        programs: {
          title: "वर्तमान कार्यक्रम"
        },
        projects: {
          title: "परियोजनाएं"
        }
      },
      loadingText: "सामग्री लोड हो रही है...",
      errorText: "सामग्री लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
      noItemsText: "इस समय कोई आइटम उपलब्ध नहीं है।"
    }
  };

  // Handle item click to show modal
  const handleItemClick = (item) => {
    setModalContent(item);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Render a media item card
  const renderMediaItem = (item) => (
    <div
      key={item._id || item.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40">
        <Image
          src={item.thumbnailPath || item.thumbnailUrl || item.filePath || item.coverImage || '/assets/images/no_image.png'}
          alt={item.title || 'Media item'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {item.fileType || item.category || "News Article"}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDate(item.uploadDate || item.createdAt || item.date)}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          <TranslateText hindiText={item.hindi_title}>
            {item.title}
          </TranslateText>
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          <TranslateText hindiText={item.hindi_description}>
            {item.description}
          </TranslateText>
        </p>
      </div>
    </div>
  );

  // Render a program card
  const renderProgramItem = (program) => (
    <div
      key={program._id || program.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => handleItemClick(program)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40">
        <Image
          src={program.thumbnailPath || program.thumbnailUrl || program.coverImage || (program.gallery && program.gallery.length > 0 ? program.gallery[0].filePath : null) || '/assets/images/no_image.png'}
          alt={program.name || program.title || 'Program'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {program.status || "Program"}
          </span>
          <span className="text-xs text-text-secondary">
            {program.beneficiaries ? `${program.beneficiaries} Beneficiaries` : formatDate(program.date)}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          <TranslateText hindiText={program.hindi_title}>
            {program.title}
          </TranslateText>
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          <TranslateText hindiText={program.hindi_description}>
            {program.description}
          </TranslateText>
        </p>
      </div>
    </div>
  );

  // Render a project card
  const renderProjectItem = (project) => (
    <div
      key={project._id || project.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => handleItemClick(project)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40">
        <Image
          src={project.thumbnailPath || project.thumbnailUrl || project.coverImage || (project.gallery && project.gallery.length > 0 ? project.gallery[0].filePath : null) || '/assets/images/no_image.png'}
          alt={project.name || project.title || 'Project'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {project.status || "Project"}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDate(project.expectedStartDate) || project.timeline || formatDate(project.date) || ''}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          <TranslateText hindiText={project.hindi_title}>
            {project.title}
          </TranslateText>
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          <TranslateText hindiText={project.hindi_description}>
            {project.description}
          </TranslateText>
        </p>
      </div>
    </div>
  );

  // Render the appropriate item based on the active tab
  const renderItem = (item) => {
    switch (activeTab) {
      case 'media':
        return renderMediaItem(item);
      case 'programs':
        return renderProgramItem(item);
      case 'projects':
        return renderProjectItem(item);
      default:
        return null;
    }
  };

  // Render a placeholder when no items are available
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Icon name="Inbox" size={48} className="mx-auto text-gray-400" />
      <h4 className="mt-4 text-xl font-semibold text-text-primary">No Items Found</h4>
      <p className="mt-2 text-text-secondary">
        There are currently no items to display in this section.
      </p>
    </div>
  );

  const renderExpandedItem = (item) => {
    switch (expandedView) {
      case 'media':
        return renderMediaItem(item);
      case 'programs':
        return renderProgramItem(item);
      case 'projects':
        return renderProjectItem(item);
      default:
        return null;
    }
  };

  // Render the content modal
  const renderContentModal = () => {
    if (!modalContent) return null;

    console.log(modalContent);
    

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title || modalContent.name}
        hindiTitle={modalContent.hindi_title}
        size="2xl"
      >
        <div className="max-h-96 overflow-y-auto">
          {/* Content Image */}
          {(modalContent.thumbnailUrl || modalContent.thumbnailPath || modalContent.filePath || modalContent.coverImage) && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={modalContent.thumbnailUrl || modalContent.thumbnailPath || modalContent.filePath || modalContent.coverImage || '/assets/images/no_image.png'}
                  alt={modalContent.title || modalContent.name}
                  className="w-full h-64 object-cover"
                />
                {modalContent.category && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {modalContent.category}
                    </span>
                  </div>
                )}
                {(modalContent.status || modalContent.fileType) && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {modalContent.status || modalContent.fileType}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {modalContent.description && (
            <div className="mb-6">
              <p className="text-text-secondary font-body leading-relaxed">
                <TranslateText hindiText={modalContent.hindi_description}>
                  {modalContent.description}
                </TranslateText>
                
              </p>
            </div>
          )}

          {/* Stats */}
          {renderStats()}

          {/* Gallery */}
          {renderGallery()}
        </div>
      </Modal>
    );
  };

  // Render stats for the modal
  const renderStats = () => {
    if (!modalContent) return null;

    const stats = [];

    if (modalContent.viewCount) stats.push({ label: 'Views', value: modalContent.viewCount, icon: 'Eye' });
    if (modalContent.gallery && modalContent.gallery.length) stats.push({ label: 'Photos', value: modalContent.gallery.length, icon: 'Image' });
    if (modalContent.beneficiaries) stats.push({ label: 'Beneficiaries', value: modalContent.beneficiaries, icon: 'Users' });
    if (modalContent.duration) stats.push({ label: 'Duration', value: modalContent.duration, icon: 'Clock' });
    if (modalContent.programDuration) stats.push({ label: 'Program Duration', value: modalContent.programDuration, icon: 'Calendar' });
    if (modalContent.budget) stats.push({ label: 'Budget', value: modalContent.budget, icon: 'IndianRupee' });
    if (modalContent.targetFarms) stats.push({ label: 'Target Farms', value: modalContent.targetFarms, icon: 'MapPin' });
    if (modalContent.location) stats.push({ label: 'Location', value: modalContent.location, icon: 'MapPin' });

    if (stats.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-heading font-semibold text-primary mb-4">Key Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full mx-auto mb-2">
                <Icon name={stat.icon} size={20} color="white" />
              </div>
              <p className="text-lg font-semibold text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render gallery for the modal
  const renderGallery = () => {
    if (!modalContent || !modalContent.gallery || modalContent.gallery.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h4 className="text-lg font-heading font-semibold text-primary mb-4">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {modalContent.gallery.map((image, index) => {
            // Handle various image formats
            let imageUrl = '';

            if (typeof image === 'string') {
              imageUrl = image;
            } else if (image && typeof image === 'object') {
              if (image.url) {
                imageUrl = image.url;
              } else if (image.filePath) {
                imageUrl = image.filePath;
              } else if (image.publicId) {
                imageUrl = `/uploads/${image.publicId}`;
              }
            }

            if (!imageUrl) return null;

            return (
              <div key={index} className="relative overflow-hidden rounded-lg group cursor-pointer">
                <Image
                  src={imageUrl}
                  alt={`${modalContent.title || modalContent.name} gallery ${index + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon name="ZoomIn" size={20} color="white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              {content[language].subtitle}
            </p>
          </div>
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-text-secondary">{content[language].loadingText}</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              {content[language].subtitle}
            </p>
          </div>
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center max-w-lg mx-auto">
            {content[language].errorText}
          </div>
        </div>
      </section>
    );
  }

  // Expanded view
  if (expandedView) {
    const expandedData = getExpandedViewData();

    return (
      <div className="fixed inset-0 bg-surface z-50 overflow-y-auto">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-text-primary">
              {content[language].tabContent[expandedView].title}
            </h2>
            <button
              onClick={closeExpandedView}
              className="p-2 rounded-md hover:bg-background transition-smooth"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {expandedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {expandedData.map(item => renderExpandedItem(item))}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">{content[language].noItemsText}</p>
          )}
        </div>
      </div>
    );
  }

  // Normal view
  const tabData = getActiveTabData();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {content[language].title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {content[language].subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-border">
          {Object.entries(content[language].tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${activeTab === key
                ? 'text-primary border-primary' : 'text-text-secondary border-transparent hover:text-primary hover:border-accent'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative">
          <h3 className="text-2xl font-heading font-semibold text-text-primary mb-8 text-center">
            {content[language].tabContent[activeTab].title}
          </h3>

          {tabData.length > 0 ? (
            <div className="px-4">
              <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                customTransition="all .5s"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                partialVisible={false}
                centerMode={false}
                ssr={true}
              >{tabData.map(item => renderItem(item))}</Carousel>
            </div>
          ) : (
            renderEmptyState()
          )}

          {/* View All Button */}
          {tabData.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigateToVisionPage(activeTab)}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
              >
                <span>View All</span>
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Modal */}
      {renderContentModal()}
    </section>
  );
};

export default OurVisionSection;