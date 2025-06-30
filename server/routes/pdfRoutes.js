const express = require('express');
const router = express.Router();
const { generateApplicationReceipt } = require('../controllers/pdfController');

// @route   POST /api/pdf/application-receipt
// @desc    Generate application receipt PDF
// @access  Public
router.post('/application-receipt', generateApplicationReceipt);

module.exports = router; 