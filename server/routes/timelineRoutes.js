const express = require('express');
const { 
  getTimelines, 
  getTimelineById, 
  createTimeline, 
  updateTimeline, 
  deleteTimeline 
} = require('../controllers/timelineController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadFields, uploadSingle, cloudinaryUpload, processCloudinaryUploads } = require('../middleware/uploadMiddleware');
const router = express.Router();

// Public routes
router.route('/').get(getTimelines);
router.route('/:id').get(getTimelineById);

// FOR DEVELOPMENT ONLY: Allow POST without authentication 
// In a production environment, uncomment the protect and admin middleware
router.route('/').post(
  // protect, admin,  // Comment these out for development
  cloudinaryUpload,
  processCloudinaryUploads,
  createTimeline
);

// FOR DEVELOPMENT ONLY: Allow PUT/DELETE without authentication
// In a production environment, uncomment the protect and admin middleware
router.route('/:id')
  .put(
    // protect, admin,  // Comment these out for development
    cloudinaryUpload,
    processCloudinaryUploads,
    updateTimeline
  )
  .delete(
    // protect, admin,  // Comment these out for development
    deleteTimeline
  );

module.exports = router; 