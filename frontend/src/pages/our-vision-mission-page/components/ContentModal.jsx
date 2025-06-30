import React, { useEffect, useState } from 'react';
import Modal from 'components/ui/Modal';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import axios from 'axios';
import TranslateText from 'components/TranslateText';

const ContentModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  console.log(content);
  

  const openGallery = (images, index) => {
    const normalized = images.map(img =>
      typeof img === 'string'
        ? img
        : img?.url || `/uploads/${img?.publicId || ''}`
    );

    setGalleryImages(normalized);
    setCurrentIndex(index);
    setIsGalleryOpen(true);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left 
      setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryImages.length]);



  // Log the entire content object when modal opens to debug gallery property
  // useEffect(() => {
  //   if (isOpen && content) {
  //     console.log('ContentModal content:', content);
  //     console.log('ContentModal gallery:', content.gallery);
  //   }
  // }, [isOpen, content]);

  // Increment view count when modal is opened (for videos only)
  useEffect(() => {
    if (isOpen && content._id && content.fileType === 'video') {
      const incrementViewCount = async () => {
        try {
          const response = await axios.put(`/api/media/${content._id}/view`);
          console.log('View count updated:', response.data);
        } catch (error) {
          console.error('Error updating view count:', error);
        }
      };

      incrementViewCount();
    }
  }, [isOpen, content._id, content.fileType]);

  const renderVideo = () => {
    if (content.fileType !== 'video') return null;

    // Check for uploadType to determine how to handle video
    if (content.uploadType === 'Video Link' && content.videoUrl) {
      // Handle YouTube videos
      if (content.videoUrl.includes('youtube.com') || content.videoUrl.includes('youtu.be')) {
        // Extract video ID
        let videoId = '';
        if (content.videoUrl.includes('v=')) {
          videoId = content.videoUrl.split('v=')[1];
          // Handle additional parameters
          const ampersandPosition = videoId.indexOf('&');
          if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
          }
        } else if (content.videoUrl.includes('youtu.be/')) {
          videoId = content.videoUrl.split('youtu.be/')[1];
        }

        return (
          <div className="mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full"
                title={content.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
              <div className="flex items-center">
                <Icon name="Eye" size={16} className="mr-1" />
                <span>{content.viewCount || 0} views</span>
              </div>
              {content.duration && (
                <div className="flex items-center">
                  <Icon name="Clock" size={16} className="mr-1" />
                  <span>{content.duration}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Handle Vimeo videos
      if (content.videoUrl.includes('vimeo.com')) {
        const vimeoId = content.videoUrl.split('/').pop();
        
        return (
          <div className="mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={`https://player.vimeo.com/video/${vimeoId}`}
                className="absolute top-0 left-0 w-full h-full"
                title={content.title || "Video"}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
              <div className="flex items-center">
                <Icon name="Eye" size={16} className="mr-1" />
                <span>{content.viewCount || 0} views</span>
              </div>
              {content.duration && (
                <div className="flex items-center">
                  <Icon name="Clock" size={16} className="mr-1" />
                  <span>{content.duration}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Fallback for other video URLs
      return (
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-lg">
            {/* Check if it's a direct video URL (mp4, webm, etc.) */}
            {content.videoUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i) ? (
              <video
                src={content.videoUrl}
                className="w-full"
                controls
                poster={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image}
                autoPlay={false}
                preload="metadata"
              />
            ) : (
              <div className="relative pb-[56.25%] h-0 bg-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Icon name="Link" size={32} className="text-primary mb-2" />
                  <p className="text-text-secondary">External video available at:</p>
                  <a 
                    href={content.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2 break-all"
                  >
                    {content.videoUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Eye" size={16} className="mr-1" />
              <span>{content.viewCount || 0} views</span>
            </div>
            {content.duration && (
              <div className="flex items-center">
                <Icon name="Clock" size={16} className="mr-1" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>
        </div>
      );
    } else if (content.uploadType === 'Upload File' && content.videoFile) {
      // Handle uploaded video file
      return (
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-lg">
            <video
              src={content.videoFile}
              className="w-full"
              controls
              poster={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image}
              autoPlay={false}
              preload="metadata"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Eye" size={16} className="mr-1" />
              <span>{content.viewCount || 0} views</span>
            </div>
            {content.duration && (
              <div className="flex items-center">
                <Icon name="Clock" size={16} className="mr-1" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Legacy handling for backward compatibility
    // Get the video URL - either from videoLink or videoUrl field
    const videoUrl = content.videoLink || content.videoUrl;

    // Handle video URL from videoUrl/videoLink field
    if (videoUrl) {
      // Handle YouTube videos
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // Extract video ID
        let videoId = '';
        if (videoUrl.includes('v=')) {
          videoId = videoUrl.split('v=')[1];
          // Handle additional parameters
          const ampersandPosition = videoId.indexOf('&');
          if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
          }
        } else if (videoUrl.includes('youtu.be/')) {
          videoId = videoUrl.split('youtu.be/')[1];
        }

        return (
          <div className="mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full"
                title={content.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
              <div className="flex items-center">
                <Icon name="Eye" size={16} className="mr-1" />
                <span>{content.viewCount || 0} views</span>
              </div>
              {content.duration && (
                <div className="flex items-center">
                  <Icon name="Clock" size={16} className="mr-1" />
                  <span>{content.duration}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Handle Vimeo videos
      if (videoUrl.includes('vimeo.com')) {
        const vimeoId = videoUrl.split('/').pop();
        
        return (
          <div className="mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={`https://player.vimeo.com/video/${vimeoId}`}
                className="absolute top-0 left-0 w-full h-full"
                title={content.title || "Video"}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
              <div className="flex items-center">
                <Icon name="Eye" size={16} className="mr-1" />
                <span>{content.viewCount || 0} views</span>
              </div>
              {content.duration && (
                <div className="flex items-center">
                  <Icon name="Clock" size={16} className="mr-1" />
                  <span>{content.duration}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Fallback for other video URLs
      return (
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-lg">
            {/* Check if it's a direct video URL (mp4, webm, etc.) */}
            {videoUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i) ? (
              <video
                src={videoUrl}
                className="w-full"
                controls
                poster={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image}
                autoPlay={false}
                preload="metadata"
              />
            ) : (
              <div className="relative pb-[56.25%] h-0 bg-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Icon name="Link" size={32} className="text-primary mb-2" />
                  <p className="text-text-secondary">External video available at:</p>
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2 break-all"
                  >
                    {videoUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Eye" size={16} className="mr-1" />
              <span>{content.viewCount || 0} views</span>
            </div>
            {content.duration && (
              <div className="flex items-center">
                <Icon name="Clock" size={16} className="mr-1" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Handle videos stored in Cloudinary/local storage
    if (content.filePath) {
      return (
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-lg">
            <video
              src={content.filePath}
              className="w-full"
              controls
              poster={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image}
              autoPlay={false}
              preload="metadata"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Eye" size={16} className="mr-1" />
              <span>{content.viewCount || 0} views</span>
            </div>
            {content.duration && (
              <div className="flex items-center">
                <Icon name="Clock" size={16} className="mr-1" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGallery = () => {
    if (!content.gallery || content.gallery.length === 0) {
      console.log('No gallery found or empty gallery');
      return null;
    }

    console.log('Rendering gallery with', content.gallery.length, 'images:', content.gallery);

    return (
      <div className="mb-6">
        <h4 className="text-lg font-heading font-semibold text-primary mb-4">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.gallery.map((image, index) => {
            // Enhanced image URL extraction with debugging
            let imageUrl = '';

            // Handle various image formats
            if (typeof image === 'string') {
              imageUrl = image;
              console.log(`Gallery image ${index} is string:`, imageUrl);
            } else if (image && typeof image === 'object') {
              if (image.url) {
                imageUrl = image.url;
                console.log(`Gallery image ${index} has url property:`, imageUrl);
              } else if (image.publicId) {
                // Try to construct URL from publicId
                imageUrl = `/uploads/${image.publicId}`;
                console.log(`Gallery image ${index} using publicId:`, imageUrl);
              }
            }

            console.log(`Gallery image ${index} final URL:`, imageUrl);

            if (!imageUrl) {
              console.log(`Gallery image ${index} has no valid URL, skipping`);
              return null;
            }

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openGallery(content.gallery, index)} // assuming content.gallery is an array of image URLs
              >
                <Image
                  src={imageUrl}
                  alt={`${content.title || content.name} gallery ${index + 1}`}
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

  // Removed the renderMilestones function as requested

  const renderStats = () => {
    const stats = [];

    if (content.viewCount) stats.push({ label: 'Views', value: content.viewCount, icon: 'Eye' });
    if (content.photos) stats.push({ label: 'Photos', value: content.photos, icon: 'Image' });
    if (content.articles) stats.push({ label: 'Articles', value: content.articles, icon: 'FileText' });
    if (content.beneficiaries) stats.push({ label: 'Beneficiaries', value: content.beneficiaries, icon: 'Users' });
    if (content.duration) stats.push({ label: 'Duration', value: content.duration, icon: 'Clock' });
    if (content.programDuration) stats.push({ label: 'Program Duration', value: content.programDuration, icon: 'Calendar' });
    if (content.budget) stats.push({ label: 'Budget', value: content.budget, icon: 'IndianRupee' });
    if (content.targetFarms) stats.push({ label: 'Target Farms', value: content.targetFarms, icon: 'MapPin' });
    if (content.location) stats.push({ label: 'Location', value: content.location, icon: 'MapPin' });

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <TranslateText hindiText={content.hindi_title || content.hindi_name}>
          {content.title || content.name || "Content Details"}
        </TranslateText>
      }
      size="2xl"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {renderVideo()}

        {/* Show main image if not a video or if video doesn't have a direct embed option */}
        {(!content.fileType || content.fileType !== 'video' || 
          (content.fileType === 'video' && !content.videoUrl && !content.videoFile)) && (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={content.image || content.filePath || content.coverImage || "/assets/images/no_image.png"}
                alt={content.title || content.name || "Content image"}
                className="w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xl font-heading font-semibold text-primary mb-4">Description</h3>
          <div className="prose prose-green max-w-none">
            <TranslateText hindiText={content.hindi_description}>
              {content.description || content.content || "No description available."}
            </TranslateText>
          </div>
        </div>

        {/* Render stats (if available) */}
        {renderStats()}

        {/* Gallery (if available) */}
        {renderGallery()}
      </div>

      {/* Full-screen gallery overlay */}
      {isGalleryOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setIsGalleryOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-black hover:bg-opacity-30"
            onClick={() => setIsGalleryOpen(false)}
          >
            <Icon name="X" size={24} color="white" />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full text-white hover:bg-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
            }}
          >
            <Icon name="ChevronLeft" size={24} color="white" />
          </button>
          
          <div className="relative max-w-5xl max-h-screen p-4">
            <Image
              src={galleryImages[currentIndex] || '/assets/images/no_image.png'}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full text-white hover:bg-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
            }}
          >
            <Icon name="ChevronRight" size={24} color="white" />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <span>{currentIndex + 1} / {galleryImages.length}</span>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ContentModal;