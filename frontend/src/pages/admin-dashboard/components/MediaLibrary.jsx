import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import mediaService from 'services/mediaService';

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch media items from the API
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true);
        const response = await mediaService.getMediaItems();
        console.log('Fetched media items:', response.data);
        setMediaItems(response.data || []);
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError('Failed to load media items');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  // Calculate counts for each category
  const getCategoryCounts = () => {
    const counts = {
      all: mediaItems.length,
      images: mediaItems.filter(item => item.fileType === 'image').length,
      videos: mediaItems.filter(item => item.fileType === 'video').length,
      documents: mediaItems.filter(item => item.fileType === 'document').length
    };
    
    return [
      { value: 'all', label: 'All Media', count: counts.all },
      { value: 'images', label: 'Images', count: counts.images },
      { value: 'videos', label: 'Videos', count: counts.videos },
      { value: 'documents', label: 'Documents', count: counts.documents }
    ];
  };

  const mediaCategories = getCategoryCounts();

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'document':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const getFileSize = (filePath) => {
    // This is a placeholder - in a real app, file size would come from the API
    return '2.4 MB';
  };

  const filteredMedia = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => {
        if (selectedCategory === 'images') return item.fileType === 'image';
        if (selectedCategory === 'videos') return item.fileType === 'video';
        if (selectedCategory === 'documents') return item.fileType === 'document';
        return true;
      });

  const handleSelectMedia = (mediaId) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMedia.length === filteredMedia.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(filteredMedia.map(item => item._id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for media:`, selectedMedia);
    setSelectedMedia([]);
  };

  const handleUpload = () => {
    console.log('Opening file upload dialog');
  };

  const handleDeleteMedia = (mediaId) => {
    console.log(`Deleting media: ${mediaId}`);
  };

  // Get the best image URL to use for display
  const getDisplayImageUrl = (item) => {
    if (item.fileType === 'video') {
      // First try to use thumbnail if available
      if (item.thumbnailUrl || item.thumbnailPath) {
        return item.thumbnailUrl || item.thumbnailPath;
      }
      
      // For video links, we may need a placeholder
      if (item.videoLink) {
        // Try to get thumbnail from YouTube or Vimeo links
        if (item.videoLink.includes('youtube.com') || item.videoLink.includes('youtu.be')) {
          const videoId = item.videoLink.includes('v=') 
            ? item.videoLink.split('v=')[1]?.split('&')[0]
            : item.videoLink.split('/').pop();
          if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          }
        } else if (item.videoLink.includes('vimeo.com')) {
          // For Vimeo, we would need to use their API to get the thumbnail
          // For now, we'll just return a placeholder
          return '/images/video-placeholder.jpg';
        }
        
        // Default placeholder for video links
        return '/images/video-placeholder.jpg';
      }
    }
    return item.filePath;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredMedia.map((item) => (
        <div key={item._id} className="card p-4 hover:shadow-lg transition-smooth">
          <div className="relative mb-4">
            <input
              type="checkbox"
              checked={selectedMedia.includes(item._id)}
              onChange={() => handleSelectMedia(item._id)}
              className="absolute top-2 left-2 z-10 rounded border-border focus:ring-primary"
            />
            
            <div className="aspect-square rounded-lg overflow-hidden bg-background">
              {item.fileType === 'image' || item.fileType === 'video' ? (
                <Image
                  src={getDisplayImageUrl(item)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name={getFileIcon(item.fileType)} size={48} className="text-accent" />
                </div>
              )}
              
              {item.fileType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-80 rounded-full p-3">
                    <Icon name="Play" size={24} color="#00712d" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute top-2 right-2">
              <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {item.fileType.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-text-primary text-sm truncate">
              {item.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{getFileSize(item.filePath)}</span>
              <span>{new Date(item.uploadDate || item.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.fileType === 'video' && item.duration && (
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs">
                  {item.duration}
                </span>
              )}
              <span className="bg-accent text-secondary px-2 py-1 rounded text-xs">
                {item.category || 'Media'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <button
              className="p-2 rounded-md hover:bg-background transition-smooth"
              title="View"
            >
              <Icon name="Eye" size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-background transition-smooth"
              title="Download"
            >
              <Icon name="Download" size={16} />
            </button>
            <button
              onClick={() => handleDeleteMedia(item._id)}
              className="p-2 rounded-md hover:bg-background transition-smooth text-error"
              title="Delete"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border focus:ring-primary"
                />
              </th>
              <th className="text-left p-4 font-medium text-text-primary">Name</th>
              <th className="text-left p-4 font-medium text-text-primary">Type</th>
              <th className="text-left p-4 font-medium text-text-primary">Size</th>
              <th className="text-left p-4 font-medium text-text-primary">Upload Date</th>
              <th className="text-left p-4 font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedia.map((item) => (
              <tr key={item._id} className="border-b border-border hover:bg-background transition-smooth">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(item._id)}
                    onChange={() => handleSelectMedia(item._id)}
                    className="rounded border-border focus:ring-primary"
                  />
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-background flex items-center justify-center overflow-hidden">
                      {item.fileType === 'image' || item.fileType === 'video' ? (
                        <Image 
                          src={getDisplayImageUrl(item)} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name={getFileIcon(item.fileType)} size={20} className="text-accent" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        {item.title}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {item.category || 'Media'}
                        {item.fileType === 'video' && item.duration && ` • ${item.duration}`}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <span className="px-2 py-1 bg-accent text-secondary text-xs rounded uppercase font-medium">
                    {item.fileType}
                  </span>
                </td>
                
                <td className="p-4 text-text-secondary">
                  {getFileSize(item.filePath)}
                </td>
                
                <td className="p-4 text-text-secondary">
                  {new Date(item.uploadDate || item.createdAt).toLocaleDateString()}
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 rounded-md hover:bg-background transition-smooth"
                      title="View"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-background transition-smooth"
                      title="Download"
                    >
                      <Icon name="Download" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item._id)}
                      className="p-2 rounded-md hover:bg-background transition-smooth text-error"
                      title="Delete"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading media items...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-12">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Error Loading Media
          </h3>
          <p className="text-text-secondary mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (filteredMedia.length === 0) {
      return (
        <div className="text-center py-12">
          <Icon name="Image" size={48} className="text-accent mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Media Found
          </h3>
          <p className="text-text-secondary mb-4">
            {selectedCategory === 'all' ?'No media files have been uploaded yet.'
              : `No ${selectedCategory} found in the library.`
            }
          </p>
          <button
            onClick={handleUpload}
            className="btn-primary"
          >
            Upload Your First File
          </button>
        </div>
      );
    }
    
    return viewMode === 'grid' ? renderGridView() : renderListView();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {mediaCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-smooth ${
                selectedCategory === category.value
                  ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedCategory === category.value
                  ? 'bg-white bg-opacity-20' :'bg-accent text-secondary'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-background'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-background'
              }`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            className="btn-primary flex items-center space-x-2"
          >
            <Icon name="Upload" size={16} />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMedia.length > 0 && (
        <div className="card bg-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-text-primary">
                {selectedMedia.length} item(s) selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('download')}
                className="btn-secondary text-sm px-4 py-2"
              >
                <Icon name="Download" size={16} className="mr-2" />
                Download
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-error text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-smooth"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Delete
              </button>
              <button
                onClick={() => setSelectedMedia([])}
                className="p-2 rounded-md hover:bg-background transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Content */}
      {renderContent()}
    </div>
  );
};

export default MediaLibrary;