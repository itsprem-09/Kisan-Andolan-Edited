import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import mediaService from 'services/mediaService';
import programService from 'services/programService';
import projectService from 'services/projectService';

const MediaCoverageSection = ({ language }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [visionData, setVisionData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeTab, setActiveTab] = useState('media');
  const [expandedView, setExpandedView] = useState(null);
  const [clickCount, setClickCount] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const response = await mediaService.getMediaAndVisionData();
        
        // Don't filter media items by category to show all media items
        setMediaItems(response.mediaItems);
        setVisionData(response.visionData);
        
        // Fetch programs data without filtering
        try {
          const programsResponse = await programService.getPrograms();
          setPrograms(programsResponse.data);
        } catch (err) {
          console.error('Error fetching programs:', err);
          // Continue even if program data fails
        }
        
        // Fetch projects data without filtering
        try {
          const projectsResponse = await projectService.getProjects();
          setProjects(projectsResponse.data);
        } catch (err) {
          console.error('Error fetching projects:', err);
          // Continue even if project data fails
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media and vision data:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleTabClick = (tab) => {
    const currentCount = clickCount[tab] || 0;
    const newCount = currentCount + 1;
    
    setClickCount({ ...clickCount, [tab]: newCount });
    setActiveTab(tab);
    
    // Second click expands to full page view
    if (newCount === 2) {
      setExpandedView(tab);
    }
  };

  const closeExpandedView = () => {
    setExpandedView(null);
    setClickCount({});
  };

  // Helper function to get file type icon
  const getFileTypeIcon = (fileType) => {
    switch(fileType) {
      case 'video':
        return 'Video';
      case 'document':
        return 'FileText';
      case 'audio':
        return 'Headphones';
      case 'image':
      default:
        return 'Image';
    }
  };

  // Format date properly
  const formatDate = (dateString) => {
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

  // Display texts based on language
  const text = {
    title: language === 'en' ? 'Media Coverage' : 'मीडिया कवरेज',
    description: language === 'en' 
      ? 'Recent press coverage and media mentions highlighting our impact on agricultural communities.' 
      : 'कृषि समुदायों पर हमारे प्रभाव को उजागर करने वाली हाल की प्रेस कवरेज और मीडिया उल्लेख।',
    viewDetails: language === 'en' ? 'View Details' : 'विवरण देखें',
    viewAllMedia: language === 'en' ? 'View All Media' : 'सभी मीडिया देखें',
    noMedia: language === 'en' ? 'No content available at the moment.' : 'इस समय कोई सामग्री उपलब्ध नहीं है।',
    loading: language === 'en' ? 'Loading content...' : 'सामग्री लोड हो रही है...',
    // Tab headers
    tabs: {
      media: language === 'en' ? 'Media' : 'मीडिया',
      programs: language === 'en' ? 'Programs' : 'कार्यक्रम',
      projects: language === 'en' ? 'Upcoming Projects' : 'आगामी परियोजनाएं'
    },
    // Our Vision headings
    vision: {
      title: language === 'en' ? 'Our Vision' : 'हमारा दृष्टिकोण',
      subtitle: language === 'en' 
        ? 'Building a sustainable future for agriculture and rural communities'
        : 'कृषि और ग्रामीण समुदायों के लिए एक स्थायी भविष्य का निर्माण',
    },
    mediaTabContent: {
      title: language === 'en' ? 'Media Coverage' : 'मीडिया कवरेज'
    },
    programsTabContent: {
      title: language === 'en' ? 'Current Programs' : 'वर्तमान कार्यक्रम'
    },
    projectsTabContent: {
      title: language === 'en' ? 'Upcoming Projects' : 'आगामी परियोजनाएं'
    },
    clickInstruction: language === 'en' 
      ? 'Click on any card or tab again to expand to full view' 
      : 'पूर्ण दृश्य के लिए किसी भी कार्ड या टैब पर फिर से क्लिक करें'
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 text-center">{text.title}</h2>
          <p className="text-center text-text-secondary mb-10 max-w-2xl mx-auto">{text.loading}</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 text-center">{text.title}</h2>
          <p className="text-center text-text-secondary mb-6 max-w-2xl mx-auto">{text.description}</p>
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center max-w-lg mx-auto">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!visionData && mediaItems.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 text-center">{text.title}</h2>
          <p className="text-center text-text-secondary mb-6 max-w-2xl mx-auto">{text.description}</p>
          <p className="text-center text-text-secondary">{text.noMedia}</p>
        </div>
      </section>
    );
  }

  if (expandedView) {
    return (
      <div className="fixed inset-0 bg-surface z-50 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-text-primary">
              {activeTab === 'media' ? text.mediaTabContent.title : 
               activeTab === 'programs' ? text.programsTabContent.title : text.projectsTabContent.title}
            </h2>
            <button
              onClick={closeExpandedView}
              className="p-2 rounded-md hover:bg-background transition-smooth"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'media' && mediaItems.map((item) => (
              <div key={item._id} className="card">
                <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                  <Image
                    src={item.filePath}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
                      {item.fileType}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {formatDate(item.uploadDate || item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex justify-end mt-2">
                    <a href={item.filePath} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors flex items-center space-x-1">
                      <span>{text.viewDetails}</span>
                      <Icon name="ArrowRight" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* For programs and projects, show actual data instead of placeholder */}
            {(activeTab === 'programs' || activeTab === 'projects') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'programs' && programs.length > 0 ? (
                  programs.map((program) => (
                    <div 
                      key={program._id}
                      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                        {program.coverImage ? (
                          <Image
                            src={program.coverImage}
                            alt={program.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Icon name="Users" size={32} className="text-primary" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
                            {language === 'en' ? program.status : 
                             program.status === 'Ongoing' ? 'चल रहा है' : 
                             program.status === 'Upcoming' ? 'आगामी' : 
                             program.status === 'Completed' ? 'पूरा हुआ' : program.status}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {program.startDate ? formatDate(program.startDate) : (
                              language === 'en' ? 'Active' : 'सक्रिय'
                            )}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-heading font-semibold text-text-primary">
                          {program.name}
                        </h4>
                        
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : activeTab === 'projects' && projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project._id}
                      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                            <Icon name="Briefcase" size={32} className="text-accent" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
                            {language === 'en' ? project.status : 
                             project.status === 'Planned' ? 'योजनाबद्ध' : 
                             project.status === 'In Progress' ? 'प्रगति पर' : 
                             project.status === 'On Hold' ? 'होल्ड पर' : 
                             project.status === 'Completed' ? 'पूरा हुआ' : 
                             project.status === 'Cancelled' ? 'रद्द' : project.status}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {project.expectedStartDate ? formatDate(project.expectedStartDate) : 
                             language === 'en' ? 'Upcoming' : 'आगामी'}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-heading font-semibold text-text-primary">
                          {project.name}
                        </h4>
                        
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <p className="text-center text-text-secondary mb-4">
                      {language === 'en' 
                        ? `No ${activeTab} available at the moment.` 
                        : `इस समय कोई ${activeTab === 'programs' ? 'कार्यक्रम' : 'परियोजनाएं'} उपलब्ध नहीं हैं।`}
                    </p>
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                      <Icon name={activeTab === 'programs' ? "Calendar" : "Briefcase"} size={32} className="text-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#f6fbf6]" id="mediaTab">
      <div className="container mx-auto px-4">
        {/* Vision Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {text.vision.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {visionData ? visionData.description : text.vision.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-border">
          {Object.entries(text.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === key
                  ? 'text-primary border-primary' :'text-text-secondary border-transparent hover:text-primary hover:border-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content - Media Items */}
        {activeTab === 'media' && (
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-semibold text-text-primary">
                {text.mediaTabContent.title}
              </h3>
              {mediaItems.length > 0 && (
                <p className="text-sm text-text-secondary mt-2">{text.clickInstruction}</p>
              )}
            </div>
            
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {mediaItems.slice(0, 3).map((item) => (
                  <div 
                    key={item._id} 
                    className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full bg-white dark:bg-surface cursor-pointer"
                    onClick={() => handleTabClick('media')}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={item.filePath}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium text-${item.fileType === 'video' ? 'green-600' : item.fileType === 'document' ? 'blue-600' : 'primary'}`}>
                          {item.fileType === 'video' ? 'Video Series' : 
                           item.fileType === 'document' ? 'News Article' : 'Documentary'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.uploadDate || item.createdAt).split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                      <h4 className="text-xl font-heading font-semibold text-gray-800 mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 mb-3 line-clamp-3 flex-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}

                {mediaItems.length > 3 && (
                  <button 
                    onClick={() => setExpandedView('media')}
                    className="md:col-span-3 mt-2 text-center text-primary hover:text-secondary transition-all duration-300 flex items-center justify-center space-x-2 py-2 border border-transparent hover:border-primary rounded-lg cursor-pointer"
                  >
                    <span>{text.viewAllMedia}</span>
                    <Icon name="ArrowRight" size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                  <Icon name="Image" size={32} className="text-primary" />
                </div>
                <p className="text-center text-text-secondary">
                  {text.noMedia}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Programs Tab Content */}
        {activeTab === 'programs' && (
          <div className="relative">
            <h3 className="text-2xl font-heading font-semibold text-text-primary mb-8 text-center">
              {text.programsTabContent.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <div 
                    key={program._id}
                    className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleTabClick('programs')}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                      {program.coverImage ? (
                        <Image
                          src={program.coverImage}
                          alt={program.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Icon name="Users" size={32} className="text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
                          {language === 'en' ? program.status : 
                           program.status === 'Ongoing' ? 'चल रहा है' : 
                           program.status === 'Upcoming' ? 'आगामी' : 
                           program.status === 'Completed' ? 'पूरा हुआ' : program.status}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {program.startDate ? formatDate(program.startDate) : (
                            language === 'en' ? 'Active' : 'सक्रिय'
                          )}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-heading font-semibold text-text-primary">
                        {program.name}
                      </h4>
                      
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-center text-text-secondary mb-4">
                    {language === 'en' 
                      ? 'No active programs available at the moment.' 
                      : 'इस समय कोई सक्रिय कार्यक्रम उपलब्ध नहीं है।'}
                  </p>
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                    <Icon name="Calendar" size={32} className="text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="relative">
            <h3 className="text-2xl font-heading font-semibold text-text-primary mb-8 text-center">
              {text.projectsTabContent.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div 
                    key={project._id}
                    className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleTabClick('projects')}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                          <Icon name="Briefcase" size={32} className="text-accent" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary bg-background px-2 py-1 rounded">
                          {language === 'en' ? project.status : 
                           project.status === 'Planned' ? 'योजनाबद्ध' : 
                           project.status === 'In Progress' ? 'प्रगति पर' : 
                           project.status === 'On Hold' ? 'होल्ड पर' : 
                           project.status === 'Completed' ? 'पूरा हुआ' : 
                           project.status === 'Cancelled' ? 'रद्द' : project.status}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {project.expectedStartDate ? formatDate(project.expectedStartDate) : 
                           language === 'en' ? 'Upcoming' : 'आगामी'}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-heading font-semibold text-text-primary">
                        {project.name}
                      </h4>
                      
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-center text-text-secondary mb-4">
                    {language === 'en' 
                      ? 'No upcoming projects available at the moment.' 
                      : 'इस समय कोई आगामी परियोजनाएं उपलब्ध नहीं हैं।'}
                  </p>
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                    <Icon name="Briefcase" size={32} className="text-accent" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaCoverageSection;