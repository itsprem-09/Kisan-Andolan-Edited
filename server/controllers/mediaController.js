const asyncHandler = require('express-async-handler');
const Media = require('../models/Media');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// @desc    Get all media items
// @route   GET /api/media
// @access  Public (or Private/Admin if only admins can see all raw media data)
const getMediaItems = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) {
    // Support multiple categories via comma-separated string
    const categories = req.query.category.split(',').map(cat => cat.trim());
    query.category = { $in: categories };
  }
  if (req.query.tabAssociation) {
    query.tabAssociation = req.query.tabAssociation;
  }
  const mediaItems = await Media.find(query).populate('uploadedBy', 'name email').sort({ uploadDate: -1 });
  res.json(mediaItems);
});

// @desc    Get single media item by ID
// @route   GET /api/media/:id
// @access  Public
const getMediaItemById = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id).populate('uploadedBy', 'name email');
  if (mediaItem) {
    res.json(mediaItem);
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

// @desc    Create a new media item
// @route   POST /api/media
// @access  Private/Admin
const createMediaItem = asyncHandler(async (req, res) => {
  console.log("Hit route");
  const { title, hindi_title, description, hindi_description, type, category, tabAssociation, uploadDate, galleryUrls, videoLink, uploadType } = req.body;
  console.log(title, hindi_title, description, hindi_description, type, category, tabAssociation, uploadDate);

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  // For video links, we don't require an uploaded file
  const isVideoLink = videoLink && (type === 'Documentary' || type === 'Video Series');
  
  // Check if we need a file or if we're using a video link
  if (!isVideoLink && (!req.files || !req.files.mediafile)) {
    res.status(400);
    throw new Error('Please upload a media file or provide a video link for videos.');
  }

  let fileType = 'image';
  if (type === 'News Article') fileType = 'document';
  if (type === 'Documentary' || type === 'Video Series') fileType = 'video';

  const mediaItem = new Media({
    title,
    hindi_title: hindi_title || '',
    description: description || '',
    hindi_description: hindi_description || '',
    uploadedBy: req.user._id,
    fileType: fileType,
    category: category || 'MediaTab',
    tabAssociation: tabAssociation || '',
    viewCount: 0,
    uploadDate: uploadDate ? new Date(uploadDate) : undefined,
  });

  // Handle video link if provided (for external videos)
  if (isVideoLink) {
    mediaItem.videoLink = videoLink;
    mediaItem.fileName = 'external_video';
    mediaItem.filePath = videoLink;
  } else {
    // Handle file upload
    const mainFile = req.files.mediafile[0];
    
    // Log the complete file object to debug
    console.log("File object for creation:", JSON.stringify(mainFile, null, 2));
    
    // Set fileName using available properties
    if (mainFile.filename) {
      mediaItem.fileName = mainFile.filename;
    } else if (mainFile.public_id) {
      mediaItem.fileName = mainFile.public_id;
    } else {
      // Extract filename from path as fallback
      const pathParts = mainFile.path.split('/');
      mediaItem.fileName = pathParts[pathParts.length - 1];
    }
    
    // Set filePath using available properties
    mediaItem.filePath = mainFile.path || mainFile.secure_url;
    
    console.log("Assigned file information:", {
      fileName: mediaItem.fileName,
      filePath: mediaItem.filePath
    });
  }

  // Handle thumbnail if provided
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
  if (thumbnailFile) {
    mediaItem.thumbnailFileName = thumbnailFile.filename;
    mediaItem.thumbnailPath = thumbnailFile.path;
  }

  // Handle gallery URLs if provided
  if (galleryUrls) {
    try {
      // Check if galleryUrls is already an array or a JSON string
      let parsedUrls;
      if (typeof galleryUrls === 'string') {
        // First check if it starts with '[' to determine if it's a JSON array
        if (galleryUrls.trim().startsWith('[')) {
          parsedUrls = JSON.parse(galleryUrls);
        } else {
          // If it's not a valid JSON string, it might be a single URL or comma-separated URLs
          parsedUrls = galleryUrls.split(',').map(url => url.trim());
        }
      } else {
        // If it's already an array, use it directly
        parsedUrls = galleryUrls;
      }

      if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
        mediaItem.gallery = parsedUrls;
      }
    } catch (err) {
      console.error('Error parsing gallery URLs:', err);
      // If parsing fails, try to treat the input as a single URL or comma-separated URLs
      try {
        const urls = galleryUrls.split(',').map(url => url.trim());
        mediaItem.gallery = urls;
      } catch (fallbackErr) {
        console.error('Fallback error handling gallery URLs:', fallbackErr);
        // Continue without setting gallery if there's a parsing error
      }
    }
  }

  // Process video duration for uploaded videos
  if (fileType === 'video' && !isVideoLink) {
    try {
      // Extract just the public_id part from the full path or filename
      // The path often looks like: rashtriya_kishan_manch/media/media_video-series_2025_06_1750771767073
      const fullPathOrFilename = mediaItem.fileName || '';
      console.log('Raw video file identifier:', fullPathOrFilename);
      
      // For Cloudinary API, we need the full path including the folder
      const cloudinaryPath = fullPathOrFilename;
      console.log('Using Cloudinary path for video duration:', cloudinaryPath);
      
      // Make the API request to get video metadata
      const result = await cloudinary.api.resource(cloudinaryPath, {
        resource_type: 'video'
      });
      
      console.log('Cloudinary video metadata result:', result);
      
      if (result && result.duration) {
        const minutes = Math.floor(result.duration / 60);
        const seconds = Math.floor(result.duration % 60);
        mediaItem.duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    } catch (err) {
      console.error('Error extracting video duration:', err);
      // Don't fail the entire upload if we can't get the duration
    }
  }

  const createdMediaItem = await mediaItem.save();
  console.log(createdMediaItem);

  res.status(201).json(createdMediaItem);
});

// @desc    Update a media item
// @route   PUT /api/media/:id
// @access  Private/Admin
const updateMediaItem = asyncHandler(async (req, res) => {
  const { title, hindi_title, description, hindi_description, type, category, tabAssociation, uploadDate, galleryUrls, videoLink, uploadType } = req.body;

  console.log("Update request body:", req.body);
  console.log("Update files:", req.files);
  
  // Check all request body keys and values for debugging
  Object.keys(req.body).forEach(key => {
    console.log(`Request body key: ${key}, value: ${req.body[key]}`);
  });

  const mediaItem = await Media.findById(req.params.id);

  if (!mediaItem) {
    res.status(404);
    throw new Error('Media item not found');
  }

  // Log the current state of the item
  console.log("Current item state:", {
    videoLink: mediaItem.videoLink, 
    fileName: mediaItem.fileName, 
    filePath: mediaItem.filePath
  });
  
  // Check if we're dealing with video types
  const isVideoType = type === 'Documentary' || type === 'Video Series';
  
  // Determine upload type being used - with extra validation
  let resolvedUploadType = uploadType;
  
  // If uploadType is missing, try to determine it
  if (!resolvedUploadType && isVideoType) {
    // If there's a videoLink in the request, assume it's Video Link
    if (videoLink) {
      resolvedUploadType = 'Video Link';
      console.log("Defaulting to Video Link due to presence of videoLink");
    } 
    // If there's a file upload, assume it's Upload File
    else if (req.files && req.files.mediafile) {
      resolvedUploadType = 'Upload File';
      console.log("Defaulting to Upload File due to presence of file upload");
    }
    // Otherwise, check the current state
    else if (mediaItem.videoLink) {
      resolvedUploadType = 'Video Link';
      console.log("Defaulting to Video Link based on current state");
    } else {
      resolvedUploadType = 'Upload File';
      console.log("Defaulting to Upload File as fallback");
    }
  }
  
  // Now proceed with the established upload type
  const isVideoLink = resolvedUploadType === 'Video Link';
  const isFileUpload = resolvedUploadType === 'Upload File';
  
  console.log(`Update mode: ${isVideoLink ? 'Video Link' : isFileUpload ? 'Upload File' : 'Unknown'} (resolved from ${uploadType || 'missing'})`);

  // Handle Video Link mode
  if (isVideoLink) {
    if (!videoLink) {
      res.status(400);
      throw new Error('Video link is required when using Video Link upload type');
    }
    
    console.log("Handling video link update:", videoLink);
    mediaItem.videoLink = videoLink;
    mediaItem.filePath = videoLink;
    
    // If switching from uploaded file to link, update the fileName
    if (!mediaItem.fileName.includes('external_video')) {
      mediaItem.fileName = 'external_video';
    }
  }
  // Handle File Upload mode
  else if (isFileUpload) {
    console.log("Handling file upload mode");
    
    // Always clear videoLink when in file upload mode
    mediaItem.videoLink = '';
    console.log("Cleared videoLink for file upload mode");
    
    // Check if a new file is being uploaded
    if (req.files && req.files.mediafile && req.files.mediafile.length > 0) {
      console.log("New file uploaded:", req.files.mediafile[0].originalname);
      const mainFile = req.files.mediafile[0];
      
      // Log the complete file object to debug
      console.log("File object:", JSON.stringify(mainFile, null, 2));
      
      // Delete old file if it exists and isn't just a link reference
      if (mediaItem.fileName && !mediaItem.fileName.includes('external_video')) {
        try {
          const resourceType = mediaItem.fileType === 'video' ? 'video' : 'image';
          await cloudinary.uploader.destroy(mediaItem.fileName, { resource_type: resourceType });
        } catch (err) {
          console.error('Cloudinary: Error deleting old file during update:', err);
        }
      }
      
      // Update with new file information - using correct property names from the Cloudinary response
      if (mainFile.filename) {
        mediaItem.fileName = mainFile.filename;
      } else if (mainFile.public_id) {
        mediaItem.fileName = mainFile.public_id;
      } else {
        // Extract filename from path as fallback
        const pathParts = mainFile.path.split('/');
        mediaItem.fileName = pathParts[pathParts.length - 1];
      }
      
      // Always use the path for filePath
      mediaItem.filePath = mainFile.path;
      
      console.log("Assigned file information:", {
        fileName: mediaItem.fileName,
        filePath: mediaItem.filePath
      });
    } 
    // No new file uploaded
    else {
      console.log("No new file uploaded in file upload mode");
      
      // If we're switching from video link to file upload but no file provided
      if (mediaItem.fileName === 'external_video' || !mediaItem.fileName) {
        res.status(400);
        throw new Error('Please upload a media file when switching from video link to file upload');
      }
      
      // Otherwise, keep existing file but ensure videoLink is cleared
      console.log("Keeping existing file but clearing video link");
    }
  }

  // Handle thumbnail update
  if (req.files && req.files.thumbnail) {
    const thumbnailFile = req.files.thumbnail[0];
    if (mediaItem.thumbnailFileName) {
      try {
        await cloudinary.uploader.destroy(mediaItem.thumbnailFileName, { resource_type: 'image' });
      } catch (err) {
        console.error('Cloudinary: Error deleting old thumbnail during update:', err);
      }
    }
    mediaItem.thumbnailFileName = thumbnailFile.public_id;
    mediaItem.thumbnailPath = thumbnailFile.secure_url;
  }

  // Handle gallery URLs if provided
  if (galleryUrls) {
    try {
      // Check if galleryUrls is already an array or a JSON string
      let parsedUrls;
      if (typeof galleryUrls === 'string') {
        // First check if it starts with '[' to determine if it's a JSON array
        if (galleryUrls.trim().startsWith('[')) {
          parsedUrls = JSON.parse(galleryUrls);
        } else {
          // If it's not a valid JSON string, it might be a single URL or comma-separated URLs
          parsedUrls = galleryUrls.split(',').map(url => url.trim());
        }
      } else {
        // If it's already an array, use it directly
        parsedUrls = galleryUrls;
      }

      if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
        mediaItem.gallery = parsedUrls;
      }
    } catch (err) {
      console.error('Error parsing gallery URLs:', err);
      // If parsing fails, try to treat the input as a single URL or comma-separated URLs
      try {
        const urls = galleryUrls.split(',').map(url => url.trim());
        mediaItem.gallery = urls;
      } catch (fallbackErr) {
        console.error('Fallback error handling gallery URLs:', fallbackErr);
        // Continue without setting gallery if there's a parsing error
      }
    }
  }

  // Update other fields
  if (type) {
    if (type === 'News Article') mediaItem.fileType = 'document';
    else if (type === 'Documentary' || type === 'Video Series') mediaItem.fileType = 'video';
    else mediaItem.fileType = 'image';
  }

  // Update basic fields
  mediaItem.title = title || mediaItem.title;
  mediaItem.hindi_title = hindi_title || mediaItem.hindi_title;
  mediaItem.description = description !== undefined ? description : mediaItem.description;
  mediaItem.hindi_description = hindi_description !== undefined ? hindi_description : mediaItem.hindi_description;
  mediaItem.category = category || mediaItem.category;
  mediaItem.tabAssociation = tabAssociation || mediaItem.tabAssociation;
  mediaItem.uploadDate = uploadDate ? new Date(uploadDate) : mediaItem.uploadDate;

  // Save the updated media item
  console.log("Final media item state before save:", {
    title: mediaItem.title,
    fileType: mediaItem.fileType,
    fileName: mediaItem.fileName,
    filePath: mediaItem.filePath,
    videoLink: mediaItem.videoLink
  });
  
  const updatedMediaItem = await mediaItem.save();
  
  if (updatedMediaItem) {
    console.log("Media item updated successfully:", updatedMediaItem._id);
    res.status(200).json(updatedMediaItem);
  } else {
    res.status(500);
    throw new Error('Failed to update media item');
  }
});

// @desc    Delete a media item
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMediaItem = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (mediaItem) {
    // Delete the main file from Cloudinary using its public_id (stored in fileName)
    if (mediaItem.fileName) {
      try {
        const resourceType = mediaItem.fileType === 'video' ? 'video' : 'image';
        const result = await cloudinary.uploader.destroy(mediaItem.fileName, { resource_type: resourceType });
        if (result.result !== 'ok' && result.result !== 'not found') {
          console.error('Cloudinary: Error deleting main file:', result);
          // Decide if you want to throw an error or just log it and proceed with DB deletion
        }
      } catch (err) {
        console.error('Cloudinary: Exception during main file deletion:', err);
        // Decide if you want to throw an error or just log it and proceed with DB deletion
      }
    }

    // Delete the thumbnail file if it exists
    if (mediaItem.thumbnailFileName) {
      try {
        const result = await cloudinary.uploader.destroy(mediaItem.thumbnailFileName, { resource_type: 'image' });
        if (result.result !== 'ok' && result.result !== 'not found') {
          console.error('Cloudinary: Error deleting thumbnail file:', result);
        }
      } catch (err) {
        console.error('Cloudinary: Exception during thumbnail deletion:', err);
      }
    }

    await mediaItem.deleteOne();
    res.json({ message: 'Media item removed' });
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

// @desc    Increment the view count for a media item
// @route   PUT /api/media/:id/view
// @access  Public
const incrementViewCount = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (mediaItem) {
    mediaItem.viewCount = (mediaItem.viewCount || 0) + 1;
    await mediaItem.save();
    res.json({ viewCount: mediaItem.viewCount });
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

module.exports = {
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  incrementViewCount,
};
