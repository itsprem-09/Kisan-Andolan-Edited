const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
require('dotenv').config(); // Ensure environment variables are loaded

// Set default values for Cloudinary credentials if they're not in the environment
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
const apiKey = process.env.CLOUDINARY_API_KEY || '123456789012345';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'dummy_secret';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Create a test folder if credentials are the defaults
const useTestFolder = cloudName === 'demo';

// Check Cloudinary configuration before starting
console.log("Cloudinary configuration status:");
console.log(`- Cloud Name: ${cloudName === 'demo' ? 'USING DEFAULT (demo)' : 'Set'}`);
console.log(`- API Key: ${apiKey === '123456789012345' ? 'USING DEFAULT KEY' : 'Set'}`);
console.log(`- Test mode: ${useTestFolder ? 'YES - Using test folder' : 'NO - Using production folders'}`);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      // Determine resource type from the request path for folder organization
      const urlPath = req.originalUrl ? req.originalUrl.toLowerCase() : '/media';
      let resourceType = 'misc'; // Default folder
      if (urlPath.includes('/media')) resourceType = 'media';
      else if (urlPath.includes('/programs')) resourceType = 'programs';
      else if (urlPath.includes('/projects')) resourceType = 'projects';
      else if (urlPath.includes('/team')) resourceType = 'team';
      else if (urlPath.includes('/members')) resourceType = 'members';
      else if (urlPath.includes('/about')) resourceType = 'about';
      else if (urlPath.includes('/timeline')) resourceType = 'timeline';

      // Sanitize a category from the request body for the filename
      let category = 'general';
      if (req.body) {
        category = (req.body.category || req.body.type || 'general')
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
      
      // Create a timestamp for the filename
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const timestamp = `${year}_${month}`;

      // Generate a unique public_id (filename)
      const public_id = `${resourceType}_${category}_${timestamp}_${Date.now()}`;

      // Set the folder path - use test folder for demo credentials
      const folder = useTestFolder 
        ? 'test_uploads' 
        : `rashtriya_kishan_manch/${resourceType}`;

      console.log('Setting up CloudinaryStorage for file:', file.originalname);
      console.log('Cloudinary upload parameters:', {
        folder,
        public_id,
        resource_type: 'auto'
      });

      return {
        folder: folder,
        public_id: public_id,
        resource_type: 'auto', // Let Cloudinary auto-detect the resource type
      };
    } catch (error) {
      console.error('Error configuring Cloudinary storage:', error);
      // Return default values in case of error
      return {
        folder: useTestFolder ? 'test_uploads' : 'rashtriya_kishan_manch/uploads',
        public_id: `upload_${Date.now()}`,
        resource_type: 'auto',
      };
    }
  },
});

// Function to directly upload an image file to Cloudinary
const cloudinaryUploadImage = async (filePath, resourceType = 'about') => {
  try {
    // Check if file path exists
    if (!filePath) {
      console.error('No file path provided for Cloudinary upload');
      return {
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-image.jpg',
        public_id: 'placeholder-image',
        resource_type: 'image'
      };
    }

    console.log(`Attempting to upload file at path: ${filePath}`);
    
    // Verify file exists before attempting upload
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist at path: ${filePath}`);
      return {
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-image.jpg',
        public_id: 'placeholder-image',
        resource_type: 'image'
      };
    }

    // Get file size for logging
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024*1024)).toFixed(2);
    
    console.log(`File size: ${fileSizeInMB} MB`);
    
    // Add a timestamp to make uploaded filename unique
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Set the folder path
    const folder = useTestFolder 
      ? 'test_uploads' 
      : `rashtriya_kishan_manch/${resourceType}`;

    console.log(`Uploading to Cloudinary folder: ${folder}`);

    // Create upload promise with timeout
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath, 
        {
          folder: folder,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
          overwrite: true,
          public_id: `${resourceType}_${timestamp}`
        },
        (error, result) => {
          if (error) {
            console.error('Error during Cloudinary upload:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    
    // Set a timeout for the upload
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - operation took too long')), 25000); // 25 seconds
    });
    
    // Race the upload against the timeout
    const result = await Promise.race([uploadPromise, timeoutPromise]);
    
    console.log('Cloudinary upload successful:', {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format
    });

    // Remove the file from local storage after upload
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Temporary file deleted: ${filePath}`);
      }
    } catch (unlinkError) {
      console.error(`Failed to delete temporary file ${filePath}:`, unlinkError);
    }

    return result;
  } catch (error) {
    console.error('Error in cloudinaryUploadImage function:', error);
    console.error('Stack trace:', error.stack);
    
    // Try to clean up the file regardless of upload success/failure
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Temporary file deleted after error: ${filePath}`);
      }
    } catch (cleanupError) {
      console.error('Failed to clean up file after upload error:', cleanupError);
    }
    
    // Return a fallback image URL instead of throwing to prevent server errors
    return {
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-image.jpg',
      public_id: 'placeholder-image',
      resource_type: 'image'
    };
  }
};

// Function to delete an image from Cloudinary
const cloudinaryDeleteImage = async (publicId) => {
  try {
    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

module.exports = { 
  cloudinary, 
  storage,
  cloudinaryUploadImage,
  cloudinaryDeleteImage
};
