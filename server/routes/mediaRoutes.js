const express = require('express');
const router = express.Router();
const {
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  incrementViewCount
} = require('../controllers/mediaController');
const { protect, admin } = require('../middleware/authMiddleware');
const { cloudinaryUpload, processCloudinaryUploads, handleUploadErrors } = require('../middleware/uploadMiddleware');

// Define the fields for file uploads - main file and thumbnail
const mediaUploadFields = [
  { name: 'mediafile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
];

// Public routes
router.route('/').get(getMediaItems);
router.route('/:id').get(getMediaItemById);
router.route('/:id/view').put(incrementViewCount);

// Admin routes
router.route('/')
  .post(protect, admin, cloudinaryUpload, handleUploadErrors, processCloudinaryUploads, createMediaItem);

router.route('/:id')
  .put(protect, admin, cloudinaryUpload, handleUploadErrors, processCloudinaryUploads, updateMediaItem)
  .delete(protect, admin, deleteMediaItem);

module.exports = router;
