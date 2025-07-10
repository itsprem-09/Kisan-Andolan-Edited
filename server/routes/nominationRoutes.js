const express = require('express');
const router = express.Router();
const {
  submitNomination,
  getNominations,
  getNominationById,
  getNominationByReference,
  updateNominationStatus,
  deleteNomination,
  getNominationStats,
  getFilteredNominationCount
} = require('../controllers/nominationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

// Configure multer upload for nomination documents
const uploadConfig = [
  { name: 'aadharCard', maxCount: 1 },
  { name: 'photograph', maxCount: 1 },
  { name: 'additionalDocument', maxCount: 1 }
];

// Public routes
router.post('/', uploadFields(uploadConfig), submitNomination);
router.get('/reference/:referenceNumber', getNominationByReference);

// Admin routes
router.get('/', protect, admin, getNominations);
router.get('/stats', protect, admin, getNominationStats);
router.get('/filtered-count', protect, admin, getFilteredNominationCount);
router.get('/:id', protect, admin, getNominationById);
router.put('/:id', protect, admin, updateNominationStatus);
router.delete('/:id', protect, admin, deleteNomination);

module.exports = router; 