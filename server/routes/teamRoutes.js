const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadSingle, cloudinaryUpload, processCloudinaryUploads } = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getTeamMembers);
router.route('/:id').get(getTeamMemberById);

// Admin routes
router.route('/')
  .post(protect, admin, cloudinaryUpload, processCloudinaryUploads, createTeamMember);

router.route('/:id')
  .put(protect, admin, cloudinaryUpload, processCloudinaryUploads, updateTeamMember)
  .delete(protect, admin, deleteTeamMember);

module.exports = router;
