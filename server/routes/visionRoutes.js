const express = require('express');
const router = express.Router();
const {
  getVision,
  createOrUpdateVision,
} = require('../controllers/visionController');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getVision)
  .post(protect, admin, uploadSingle('image'), createOrUpdateVision);

module.exports = router;
