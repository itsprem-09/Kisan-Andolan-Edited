const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// For initial admin registration, you might want to protect this route as well,
// or handle it via a seeding script or direct database insertion for the first admin.
// This route is now protected: only an existing admin can register new users.
router.post('/register', protect, admin, registerUser); 
// Note: To create the first admin, you might need to temporarily remove 'protect, admin',
// register the first admin, and then add these middlewares back. 
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
