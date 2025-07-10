const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload an image to Cloudinary
 * @param {string} imagePath - Path to the image file
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const cloudinaryUploadImage = async (imagePath, folder = '') => {
  try {
    console.log(`Uploading image to Cloudinary: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }
    
    // Configure upload options
    const uploadOptions = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      resource_type: 'auto' // Auto-detect resource type (image, video, etc.)
    };
    
    // Add folder if specified
    if (folder) {
      uploadOptions.folder = folder;
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, uploadOptions);
    
    // Delete local file after successful upload
    fs.unlinkSync(imagePath);
    
    console.log(`Successfully uploaded to Cloudinary: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const cloudinaryDeleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Successfully deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    console.error(`Error deleting from Cloudinary (${publicId}):`, error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const cloudinaryDeleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    console.log(`Successfully deleted ${publicIds.length} resources from Cloudinary`);
    return result;
  } catch (error) {
    console.error('Error deleting multiple resources from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
  cloudinaryDeleteMultipleImages
};
