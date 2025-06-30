import React, { useState, useRef } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';

const ContentCard = ({ item = {}, toggleBookmark, bookmarkedResources = [], onCardClick }) => {
  if (!item) return null;
  
  // Add state for hover
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  
  // Add default empty array for bookmarkedResources
  const isBookmarked = bookmarkedResources && bookmarkedResources.includes(item._id || item.id);
  
  // Format date with validation and multiple fallback options
  const formatDate = () => {
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
          // Try to create a valid date object
          const date = new Date(dateString);
          
          // Check if date is valid
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
        } catch (error) {
          // Continue to next date if this one fails
          continue;
        }
      }
    }
    
    // If we have a numeric timestamp (milliseconds since epoch)
    if (typeof item.timestamp === 'number') {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // If all attempts failed, use the current date as fallback
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const date = formatDate();

  const isVideo = item.fileType === 'video';
  
  // Handle mouse enter for video playback
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        // Auto-play might be blocked by browser policy
        console.log('Video auto-play was prevented:', error);
      });
    }
  };
  
  // Handle mouse leave to pause video
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      // Optionally reset to beginning
      // videoRef.current.currentTime = 0;
    }
  };

  // Handle card click to show details
  const handleCardClick = (e) => {
    // Prevent triggering when clicking bookmark button or view link
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }

    if (onCardClick && typeof onCardClick === 'function') {
      onCardClick(item);
    }
  };

  // Get category display name with safety check
  const getCategoryDisplay = () => {
    if (!item.category) return 'General';
    return item.category.charAt(0).toUpperCase() + item.category.slice(1);
  };
  
  // Handle bookmark toggle with safety check
  const handleBookmarkToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    if (toggleBookmark && typeof toggleBookmark === 'function') {
      toggleBookmark(item._id || item.id);
    }
  };
  
  // Handle view button click with safety check
  const handleViewClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onCardClick && typeof onCardClick === 'function') {
      onCardClick(item);
    }
  };
  
  // Get video source from item
  const getVideoSource = () => {
    // Check for uploadType to determine how to handle video
    if (item.uploadType === 'Video Link' && item.videoUrl) {
      // If it's a video link, check if it's a direct video URL
      if (item.videoUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
        return item.videoUrl;
      }
      // Can't autoplay YouTube/Vimeo in cards, so return null
      return null;
    } else if (item.uploadType === 'Upload File' && item.videoFile) {
      // If it's an uploaded file, use videoFile
      return item.videoFile;
    }
    
    // Legacy checks for backward compatibility
    if (item.videoLink) {
      // Check for external video link first
      if (item.videoLink.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
        return item.videoLink;
      }
      // Can't autoplay YouTube/Vimeo in cards, so return null
      return null;
    }
    
    if (item.videoUrl) {
      // Direct video URL or external video
      if (item.videoUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
        return item.videoUrl;
      }
      // Can't autoplay YouTube/Vimeo in cards, so return null
      return null;
    }
    
    // Check for filePath that might be a video
    if (item.filePath && item.filePath.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
      return item.filePath;
    }
    
    return null;
  };
  
  const videoSource = isVideo ? getVideoSource() : null;
  const canPlayVideo = isVideo && videoSource;
  
  return (
    <div
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        {/* Image/Video Thumbnail */}
        <div className="h-48 rounded-t-lg overflow-hidden mb-4 relative">
          {canPlayVideo ? (
            <video
              ref={videoRef}
              src={videoSource}
              className="w-full h-full object-cover"
              poster={item.thumbnailUrl || item.thumbnailPath || item.thumbnail || item.image}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={item.thumbnailUrl || item.thumbnailPath || item.thumbnail || item.image || item.filePath || '/public/assets/images/no_image.png'}
              alt={item.title || 'Content image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {isVideo && (
            <>
              <div className={`absolute inset-0 bg-black ${isHovered && canPlayVideo ? 'bg-opacity-20' : 'bg-opacity-40'} flex items-center justify-center ${isHovered && canPlayVideo ? 'opacity-0' : 'opacity-60'} transition-opacity duration-300`}>
                <div className="bg-white bg-opacity-80 rounded-full p-3">
                  <Icon name="Play" size={24} color="#00712d" />
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
                  {item.duration}
                </div>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block bg-accent bg-opacity-30 text-secondary text-xs px-2 py-1 rounded">
              {getCategoryDisplay()}
            </span>
            <button
              onClick={handleBookmarkToggle}
              className="text-text-secondary hover:text-primary transition-smooth"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={18} />
            </button>
          </div>

          <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
            <TranslateText hindiText={item.hindi_title}>
              {item.title || 'Untitled Content'}
            </TranslateText>
          </h3>

          <p className="text-text-secondary text-sm mb-4 flex-1">
            <TranslateText hindiText={`${item.hindi_description.slice(0, 51)}...`}>
              {item.description ? 
                (item.description.length > 50 ? 
                  `${item.description.slice(0, 51)}...` : 
                  item.description) : 
                'No description available'
              }
            </TranslateText>
          </p>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
            <span className="text-xs text-text-secondary">
              {date}
            </span>

            <div className="flex items-center space-x-3">
              <span className="flex items-center text-xs text-text-secondary">
                <Icon name={isVideo ? "Eye" : "BarChart2"} size={14} className="mr-1" />
                {item.engagementMetric || item.viewCount || 0}
              </span>
              <button 
                onClick={handleViewClick}
                className="flex items-center text-primary hover:text-secondary transition-colors text-sm font-medium"
              >
                <span>View</span>
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;