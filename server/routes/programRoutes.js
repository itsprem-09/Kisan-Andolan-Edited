const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/programController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadFields, cloudinaryUpload, processCloudinaryUploads } = require('../middleware/uploadMiddleware');

// Configure upload fields for programs - coverImage (single file) and gallery (multiple files)
const programUploadFields = [
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 } // Allow up to 10 gallery images
];

// Public routes
router.route('/').get(getPrograms);
router.route('/:id').get(getProgramById);

// Admin routes
router.route('/')
  .post(protect, admin, cloudinaryUpload, processCloudinaryUploads, createProgram);

router.route('/:id')
  .put(protect, admin, cloudinaryUpload, processCloudinaryUploads, updateProgram)
  .delete(protect, admin, deleteProgram);

module.exports = router;
