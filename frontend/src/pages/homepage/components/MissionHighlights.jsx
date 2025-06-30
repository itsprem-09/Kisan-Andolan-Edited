import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import mediaService from 'services/mediaService';
import programService from 'services/programService';
import projectService from 'services/projectService';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useLanguage } from '../../../contexts/LanguageContext';
import TranslateText from '../../../components/TranslateText';

const MissionHighlights = () => {
  const { language, getTranslation } = useLanguage();
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [combinedItems, setCombinedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [mediaRes, programsRes, projectsRes] = await Promise.all([
          mediaService.getMediaItems(),
          programService.getPrograms(),
          projectService.getProjects(),
        ]);

        console.log('Media response:', mediaRes);
        const mediaData = mediaRes.data || [];
        const programsData = programsRes.data || [];
        const projectsData = projectsRes.data || [];
        
        // Create combined array with type indicators
        const taggedMedia = mediaData.map(item => ({ ...item, itemType: 'media' }));
        const taggedPrograms = programsData.map(item => ({ ...item, itemType: 'programs' }));
        const taggedProjects = projectsData.map(item => ({ ...item, itemType: 'projects' }));
        
        // Combine and shuffle all items
        const allItems = [...taggedMedia, ...taggedPrograms, ...taggedProjects];
        const shuffledItems = shuffleArray(allItems);
        
        // Slice to get a reasonable number for the carousel
        setCombinedItems(shuffledItems.slice(0, 9));

      } catch (err) {
        console.error("Error fetching data for Our Vision section:", err);
        setError("Failed to load data. Please try again later.");
        // Clear data on error to avoid showing stale info
        setCombinedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

   const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const content = {
    en: {
      title: "Our Mission Highlights",
      subtitle: "Transforming agriculture through innovation, education, and community empowerment",
      tabContent: {
        media: "Media Coverage",
        programs: "Current Programs", 
        projects: "Projects"
      },
      loadingText: "Loading content...",
      errorText: "Failed to load content. Please try again later.",
      noItemsText: "No items available at the moment.",
      viewAll: "View All"
    },
    hi: {
      title: "हमारे मिशन की मुख्य बातें",
      subtitle: "नवाचार, शिक्षा और सामुदायिक सशक्तिकरण के माध्यम से कृषि का रूपांतरण",
       tabContent: {
        media: "मीडिया कवरेज",
        programs: "वर्तमान कार्यक्रम",
        projects: "परियोजनाएं"
      },
      loadingText: "सामग्री लोड हो रही है...",
      errorText: "सामग्री लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
      noItemsText: "इस समय कोई आइटम उपलब्ध नहीं है।",
      viewAll: "सभी देखें"
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
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
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

   // Render a media item card
  const renderMediaItem = (item) => (
    <div 
      key={item._id || item.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mx-2 h-[400px] flex flex-col bg-white"
      onClick={() => navigate('/our-vision-mission-page')}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40 w-full flex-shrink-0">
        <Image
          src={item.thumbnailPath || item.thumbnailUrl || item.filePath || item.coverImage || '/assets/images/no_image.png'}
          alt={item.title || 'Media item'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="space-y-3 p-4 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {content[language].tabContent.media}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDate(item.uploadDate || item.createdAt || item.date)}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          {item.title || 'Untitled Media'}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {item.description || 'No description available'}
        </p>
      </div>
    </div>
  );

  // Render a program card
  const renderProgramItem = (program) => (
    <div 
      key={program._id || program.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mx-2 h-[400px] flex flex-col bg-white"
      onClick={() => navigate('/our-vision-mission-page')}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40 w-full flex-shrink-0">
        <Image
          src={program.thumbnailPath || program.thumbnailUrl || program.coverImage || (program.gallery && program.gallery.length > 0 ? program.gallery[0].filePath : null) || '/assets/images/no_image.png'}
          alt={program.name || program.title || 'Program'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="space-y-3 p-4 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {content[language].tabContent.programs}
          </span>
          <span className="text-xs text-text-secondary">
            {program.beneficiaries ? `${program.beneficiaries} Beneficiaries` : formatDate(program.date)}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          {program.name || program.title || 'Untitled Program'}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {program.description || 'No description available'}
        </p>
      </div>
    </div>
  );

  // Render a project card
  const renderProjectItem = (project) => (
    <div 
      key={project._id || project.id}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mx-2 h-[400px] flex flex-col bg-white"
      onClick={() => navigate('/our-vision-mission-page')}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 h-40 w-full flex-shrink-0">
        <Image
          src={project.thumbnailPath || project.thumbnailUrl || project.coverImage || (project.gallery && project.gallery.length > 0 ? project.gallery[0].filePath : null) || '/assets/images/no_image.png'}
          alt={project.name || project.title || 'Project'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="space-y-3 p-4 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
            {content[language].tabContent.projects}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDate(project.expectedStartDate) || project.timeline || formatDate(project.date) || ''}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          {project.name || project.title || 'Untitled Project'}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {project.description || 'No description available'}
        </p>
      </div>
    </div>
  );

   const renderEmptyState = () => (
    <div className="text-center py-12">
      <Icon name="Inbox" size={48} className="mx-auto text-gray-400" />
      <h4 className="mt-4 text-xl font-semibold text-text-primary">No Items Found</h4>
      <p className="mt-2 text-text-secondary">
        {content[language].noItemsText}
      </p>
    </div>
  );

  const renderItem = (item) => {
    switch (item.itemType) {
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

  return (
    <section className="py-16 md:py-24 bg-surface">
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

        {/* Highlights Grid */}
        <div className="relative">          
          {combinedItems.length > 0 ? (
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
              >
                {combinedItems.map(item => renderItem(item))}
              </Carousel>
              <style jsx global>{`
                .carousel-container {
                  padding-bottom: 40px;
                }
                .carousel-container .react-multi-carousel-item {
                  height: 500px;
                  display: flex;
                }
                .carousel-container .react-multi-carousel-item > div {
                  width: 100%;
                  height: 100%;
                  margin: 0 8px;
                  padding: 2px;
                  overflow : hidden;
                }
              `}</style>
            </div>
          ) : (
            renderEmptyState()
          )}
          
          {/* View All Button */}
          {/* {combinedItems.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigateToVisionPage()}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
              >
                <span>{getTranslation('viewAll')}</span>
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </button>
            </div>
          )} */}
        </div>

        {/* Call to Action */}
        
      </div>
    </section>
  );
};

export default MissionHighlights;