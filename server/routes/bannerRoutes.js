const express = require('express');
const router = express.Router();
const {
  createBanner,
  getBanners,
  editBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const {
  cloudinaryUpload,
  processCloudinaryUploads,
} = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBanners);
router
  .route('/upload')
  .post(protect, admin, cloudinaryUpload, processCloudinaryUploads, createBanner);

router
  .route('/:public_id(*)')
  .put(protect, admin, cloudinaryUpload, processCloudinaryUploads, editBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;
