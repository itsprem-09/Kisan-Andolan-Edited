const express = require('express');
const router = express.Router();
const { 
  getAboutContent, 
  updateImpactMetrics, 
  updateInfoBoxes, 
  updateTestimonials, 
  updateCommunityStats, 
  updatePartners, 
  updatePartnershipApproach 
} = require('../controllers/aboutController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAboutContent);

// Admin routes
router.put('/impact-metrics', protect, admin, updateImpactMetrics);
router.put('/info-boxes', protect, admin, updateInfoBoxes);
router.put('/testimonials', protect, admin, uploadSingle('image'), updateTestimonials);
router.put('/community-stats', protect, admin, updateCommunityStats);
router.put('/partners', protect, admin, updatePartners);
router.put('/partnership-approach', protect, admin, updatePartnershipApproach);

module.exports = router; 