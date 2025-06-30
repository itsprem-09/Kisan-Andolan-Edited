const express = require('express');
const {
  createPartnerInquiry,
  getPartnerInquiries,
  updatePartnerInquiry,
  deletePartnerInquiry
} = require('../controllers/partnerInquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for submitting inquiries
router.post('/', createPartnerInquiry);

// Admin routes for managing inquiries
router.get('/', protect, admin, getPartnerInquiries);
router.put('/:id', protect, admin, updatePartnerInquiry);
router.delete('/:id', protect, admin, deletePartnerInquiry);

module.exports = router; 