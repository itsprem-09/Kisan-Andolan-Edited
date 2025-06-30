import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import mediaService from 'services/mediaService';
import TranslateText from 'components/TranslateText';

const MediaCarousel = ({ onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

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

  // Fetch media data from the database
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const response = await mediaService.getMediaItems();
        
        // Process the media items from the response
        if (response.data && response.data.length > 0) {
          const processedMedia = response.data.map(item => ({
            id: item._id,
            type: item.fileType || 'image',
            title: item.title,
            hindi_title: item.hindi_title || '',
            description: item.description || '',
            hindi_description: item.hindi_description || '',
            thumbnail: item.filePath,
            thumbnailUrl: item.thumbnailPath || item.thumbnailUrl,
            thumbnailPath: item.thumbnailPath,
            image: item.filePath,
            filePath: item.filePath,
            views: item.viewCount || 0,
            duration: item.duration || '',
            category: item.category || 'Media',
            gallery: item.gallery || [],
            content: item.description || '',
            fileType: item.fileType || 'image',
            viewCount: item.viewCount || 0,
            uploadDate: item.uploadDate
          }));
          setMediaItems(processedMedia);
        } else {
          // Use fallback data if no items returned
          setMediaItems(fallbackMediaItems);
        }
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError('Failed to load media content. Please try again later.');
        // Use fallback data on error
        setMediaItems(fallbackMediaItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // Fallback data in case the API fails
  const fallbackMediaItems = [
    {
      id: 1,
      type: 'video',
      title: 'Farmer Success Stories',
      description: 'Inspiring stories of farmers who transformed their lives through our programs and initiatives.',
      thumbnail: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: '12.5K',
      duration: '8:45',
      category: 'Success Stories',
      content: `Our farmer success stories showcase the incredible transformation that occurs when traditional farming meets modern techniques and community support.`,
      gallery: [
        'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ]
    },
    {
      id: 2,
      type: 'gallery',
      title: 'Community Events Gallery',
      description: 'Photo highlights from our recent community gatherings, training sessions, and agricultural fairs.',
      thumbnail: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: 45,
      category: 'Events',
      content: `Our community events bring together farmers, experts, and stakeholders to share knowledge.`,
      gallery: [
        'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2518861/pexels-photo-2518861.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <Icon name="AlertTriangle" size={48} className="text-error mb-4" />
        <p className="text-error text-lg">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <Icon name="Camera" size={48} className="text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No media content available.</p>
      </div>
    );
  }
  console.log(mediaItems);
  

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl" ref={carouselRef}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {mediaItems.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {/* Featured Card */}
                <div 
                  className="md:col-span-2 lg:col-span-2 card-elevated cursor-pointer group transition-all duration-200 hover:shadow-xl"
                  onClick={() => onCardClick(item)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <Image 
                      src={item.thumbnailUrl || item.thumbnailPath || item.thumbnail || item.image || item.filePath}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {item.type === 'video' && (
                        <div className="bg-white rounded-full p-3">
                          <Icon name="Play" size={24} color="#00712d" />
                        </div>
                      )}
                      {item.type !== 'video' && (
                        <div className="bg-white rounded-full p-3">
                          <Icon name={item.type === 'press' ? 'FileText' : 'Image'} size={24} color="#00712d" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {item.category}
                      </span>
                    </div>
                    {item.type === 'video' && item.duration && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {item.duration}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    <TranslateText hindiText={item.hindi_title}>
                      {item.title}
                    </TranslateText>
                  </h3>
                  <p className="text-text-secondary mb-4 font-body">
                    <TranslateText hindiText={item.hindi_description}>
                      {item.description}
                    </TranslateText>
                  </p>
                  <p>{formatFullDate(item.uploadDate)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      
                      {item.gallery && item.gallery.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Image" size={16} />
                          <span>{item.gallery.length} photos</span>
                        </div>
                      )}
                    </div>
                    <button className="flex items-center space-x-1 text-primary hover:text-secondary transition-colors">
                      <span className="text-sm font-medium">View Details</span>
                      <Icon name="ArrowRight" size={16} />
                    </button>
                  </div>
                </div>

                {/* Side Cards */}
                <div className="space-y-6">
                  {mediaItems.slice(0, 2).filter(sideItem => sideItem.id !== item.id).map((sideItem) => (
                    <div 
                      key={`side-${sideItem.id}`}
                      className="card cursor-pointer group transition-all duration-200 hover:shadow-md"
                      onClick={() => onCardClick(sideItem)}
                    >
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <Image 
                          src={sideItem.thumbnailUrl || sideItem.thumbnailPath || sideItem.thumbnail || sideItem.image || sideItem.filePath}
                          alt={sideItem.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {sideItem.type === 'video' && (
                            <div className="bg-white rounded-full p-2">
                              <Icon name="Play" size={16} color="#00712d" />
                            </div>
                          )}
                          {sideItem.type !== 'video' && (
                            <div className="bg-white rounded-full p-2">
                              <Icon name={sideItem.type === 'press' ? 'FileText' : 'Image'} size={16} color="#00712d" />
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="font-heading font-medium text-primary mb-1 text-sm">
                        <TranslateText hindiText={sideItem.hindi_title}>
                          {sideItem.title}
                        </TranslateText>
                      </h4>
                      <p className="text-text-secondary text-xs font-body line-clamp-2">
                        <TranslateText hindiText={sideItem.hindi_description}>
                          {sideItem.description}
                        </TranslateText>
                      </p>
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
          {mediaItems.map((_, index) => (
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

export default MediaCarousel;