import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import programService from 'services/programService';
import TranslateText from 'components/TranslateText';

const ProgramsCarousel = ({ onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Fetch programs from API
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await programService.getPrograms();
        
        console.log('Raw program data from API:', response.data);
        
        // Map the API response to match our component's expected format
        const formattedPrograms = response.data.map(program => {
          // Handle gallery data specifically with better error handling
          let galleryImages = [];
          
          if (program.gallery && Array.isArray(program.gallery)) {
            galleryImages = program.gallery.map(img => {
              // If image is a string, use it directly
              if (typeof img === 'string') return img;
              // If image is an object with url property, use that
              if (img && typeof img === 'object' && img.url) return img.url;
              // If image has no url but has publicId, try to construct a URL (Cloudinary format)
              if (img && typeof img === 'object' && img.publicId) {
                // Assuming Cloudinary URL format, try to construct a URL
                return `/uploads/${img.publicId}`;
              }
              return null;
            }).filter(Boolean); // Remove any null/undefined entries
            
            console.log(`Processed gallery for program ${program._id}:`, galleryImages);
          }
          
          return {
            id: program._id,
            title: program.name, // API uses 'name', our component expects 'title'
            hindi_title: program.hindi_name || '',
            description: program.description,
            hindi_description: program.hindi_description || '',
            image: program.coverImage,
            beneficiaries: program.beneficiaries || 'Not specified',
            duration: program.programDuration || 'Ongoing',
            status: program.status,
            impact: program.impact || 'Ongoing assessment',
            category: program.category || 'Program',
            content: program.description, // Use description as content if no dedicated content field
            gallery: galleryImages
          };
        });
        
        console.log('Formatted programs with gallery:', formattedPrograms);
        
        setPrograms(formattedPrograms);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
        
        // Fallback to empty array
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const nextSlide = () => {
    if (programs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % programs.length);
  };

  const prevSlide = () => {
    if (programs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + programs.length) % programs.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text-secondary">Loading programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        <Icon name="AlertTriangle" size={32} className="mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Unable to Load Programs</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-background border border-border p-8 rounded-xl text-center">
        <Icon name="Info" size={32} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium text-primary mb-2">No Programs Available</h3>
        <p className="text-text-secondary">Check back later for upcoming programs.</p>
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
          {programs.map((program) => (
            <div key={program.id} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {/* Featured Program Card */}
                <div 
                  className="md:col-span-2 lg:col-span-2 card-elevated cursor-pointer group transition-all duration-200 hover:shadow-xl"
                  onClick={() => {
                    console.log('Clicking program card:', program);
                    console.log('Program gallery:', program.gallery);
                    onCardClick(program);
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    {program.image ? (
                      <Image 
                        src={program.image}
                        alt={program.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <Icon name="Image" size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white rounded-full p-3">
                        <Icon name="ArrowRight" size={24} color="#00712d" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {program.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        program.status === 'Ongoing' ? 'bg-success text-white' : 
                        program.status === 'Upcoming' ? 'bg-warning text-white' : 
                        'bg-secondary text-white'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    <TranslateText hindiText={program.hindi_title}>
                      {program.title}
                    </TranslateText>
                  </h3>
                  <p className="text-text-secondary mb-4 font-body">
                    <TranslateText hindiText={program.hindi_description}>
                      {program.description}
                    </TranslateText>
                  </p>
                  
                  {/* Program Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Users" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Beneficiaries</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">{program.beneficiaries}</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Clock" size={16} color="#00712d" />
                        <span className="text-sm font-medium text-text-secondary">Duration</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">{program.duration}</p>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors">
                    <span className="font-medium">Learn More</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>

                {/* Side Program Cards */}
                <div className="space-y-6">
                  {programs
                    .filter(p => p.id !== program.id) // Don't show current program
                    .slice(0, 2) // Show up to 2 other programs
                    .map((sideProgram) => (
                      <div 
                        key={`side-${sideProgram.id}`}
                        className="card cursor-pointer group transition-all duration-200 hover:shadow-md"
                        onClick={() => {
                          console.log('Clicking side program card:', sideProgram);
                          console.log('Side program gallery:', sideProgram.gallery);
                          onCardClick(sideProgram);
                        }}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          {sideProgram.image ? (
                            <Image 
                              src={sideProgram.image}
                              alt={sideProgram.title}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                              <Icon name="Image" size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                              {sideProgram.category}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-heading font-medium text-primary mb-1 text-sm">
                          <TranslateText hindiText={sideProgram.hindi_title}>
                            {sideProgram.title}
                          </TranslateText>
                        </h4>
                        <p className="text-text-secondary text-xs font-body line-clamp-2 mb-2">
                          <TranslateText hindiText={sideProgram.hindi_description}>
                            {sideProgram.description}
                          </TranslateText>
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{sideProgram.beneficiaries} beneficiaries</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            sideProgram.status === 'Ongoing' ? 'bg-success text-white' : 
                            sideProgram.status === 'Upcoming' ? 'bg-warning text-white' : 
                            'bg-secondary text-white'
                          }`}>
                            {sideProgram.status}
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
          {programs.map((_, index) => (
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

export default ProgramsCarousel;