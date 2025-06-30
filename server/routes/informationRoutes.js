const express = require('express');
const router = express.Router();
const {
  getInformationItems,
  createInformationItem,
  updateInformationItem,
  deleteInformationItem,
} = require('../controllers/informationController');
const { uploadSingle, cloudinaryUpload, processCloudinaryUploads, handleUploadErrors } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getInformationItems)
  .post(protect, admin, cloudinaryUpload, handleUploadErrors, processCloudinaryUploads, createInformationItem);

router
  .route('/:groupTitle/:id')
  .put(protect, admin, cloudinaryUpload, handleUploadErrors, processCloudinaryUploads, updateInformationItem)
  .delete(protect, admin, deleteInformationItem);

module.exports = router;
