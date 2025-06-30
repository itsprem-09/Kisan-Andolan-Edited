import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import projectService from 'services/projectService';
import TranslateText from 'components/TranslateText';

const UpcomingProjectsCarousel = ({ onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  // Fetch projects from the database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getProjects();
        setProjects(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const nextSlide = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return 'bg-warning text-white';
      case 'In Progress': return 'bg-success text-white';
      case 'On Hold': return 'bg-primary text-white';
      case 'Completed': return 'bg-secondary text-white';
      case 'Cancelled': return 'bg-error text-white';
      default: return 'bg-border text-text-secondary';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Calendar" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-primary mb-2">No Projects Available</h3>
        <p className="text-text-secondary">Check back later for upcoming projects.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl" ref={carouselRef}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project._id} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {/* Featured Project Card */}
                <div 
                  className="md:col-span-2 lg:col-span-2 card-elevated cursor-pointer group transition-all duration-200 hover:shadow-xl"
                  onClick={() => onCardClick(project)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <Image 
                      src={project.coverImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'}
                      alt={project.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white rounded-full p-3">
                        <Icon name="Calendar" size={24} color="#00712d" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {project.location || 'Project'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    <TranslateText hindiText={project.hindi_name}>
                      {project.name}
                    </TranslateText>
                  </h3>
                  <p className="text-text-secondary mb-4 font-body">
                    <TranslateText hindiText={project.hindi_description}>
                      {project.description}
                    </TranslateText>
                  </p>
                  
                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Calendar" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Start Date</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {project.expectedStartDate ? new Date(project.expectedStartDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="IndianRupee" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Budget</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{project.budget}</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Users" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Target Farms</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{project.targetFarms}</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="MapPin" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Location</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{project.location || 'Multiple Locations'}</p>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors">
                    <span className="font-medium">View Project Details</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>

                {/* Side Project Cards */}
                <div className="space-y-6">
                  {projects.slice(0, 2).map((sideProject, idx) => (
                    <div 
                      key={`side-${sideProject._id}-${idx}`}
                      className="card cursor-pointer group transition-all duration-200 hover:shadow-md"
                      onClick={() => onCardClick(sideProject)}
                    >
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <Image 
                          src={sideProject.coverImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'}
                          alt={sideProject.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                            {sideProject.location || 'Project'}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sideProject.status)}`}>
                            {sideProject.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-heading font-medium text-primary mb-1 text-sm">
                        <TranslateText hindiText={sideProject.hindi_name}>
                          {sideProject.name}
                        </TranslateText>
                      </h4>
                      <p className="text-text-secondary text-xs font-body line-clamp-2 mb-2">
                        <TranslateText hindiText={sideProject.hindi_description}>
                          {sideProject.description}
                        </TranslateText>
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>{sideProject.targetFarms} farms</span>
                        <span className="px-2 py-1 rounded text-xs">
                          {sideProject.budget}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevSlide}
          className="flex items-center justify-center w-10 h-10 bg-surface border border-border rounded-full hover:bg-background transition-colors touch-target"
          aria-label="Previous slide"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-border'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center justify-center w-10 h-10 bg-surface border border-border rounded-full hover:bg-background transition-colors touch-target"
          aria-label="Next slide"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
    </div>
  );
};

export default UpcomingProjectsCarousel;