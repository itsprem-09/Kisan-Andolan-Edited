const express = require('express');
const router = express.Router();
const {
  registerMember,
  verifyOtp,
  getMemberApplications,
  getMemberApplicationById,
  updateMemberApplication,
  deleteMemberApplication,
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadSingle } = require('../middleware/uploadMiddleware');

// Public route for submitting applications
router.post('/', uploadSingle('documentPhoto'), registerMember);
router.post('/verify-otp', verifyOtp); // Public route for OTP verification

// Admin routes for managing member applications
router.route('/')
  .get(protect, admin, getMemberApplications); // Renamed to avoid conflict with POST

router.route('/:id')
  .get(protect, admin, getMemberApplicationById)
  .put(protect, admin, uploadSingle('documentPhoto'), updateMemberApplication)
  .delete(protect, admin, deleteMemberApplication);

module.exports = router;
