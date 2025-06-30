const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/razorpayController');

router.route('/create-order').post(createOrder);

module.exports = router;