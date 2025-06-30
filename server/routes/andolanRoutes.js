const express = require('express');
const router = express.Router();
const {
  getAndolanEvents,
  createAndolanEvent,
  updateAndolanEvent,
  deleteAndolanEvent,
} = require('../controllers/andolanController');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

router
  .route('/')
  .get(getAndolanEvents)
  .post(protect, admin, uploadSingle('image'), createAndolanEvent);

router
  .route('/:id')
  .put(protect, admin, uploadSingle('image'), updateAndolanEvent)
  .delete(protect, admin, deleteAndolanEvent);

module.exports = router;
