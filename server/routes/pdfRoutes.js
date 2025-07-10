const express = require('express');
const router = express.Router();
const { 
  generateApplicationReceipt,
  generateNominationReceipt,
  exportMembersToExcel,
  exportYouthToExcel,
  exportNominationsToExcel,
  exportMembersToPdf,
  exportYouthToPdf,
  exportNominationsToPdf,
  exportSelectedMembersToExcel,
  exportSelectedMembersToPdf
} = require('../controllers/pdfController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes - Individual receipts
// @route   POST /api/pdf/application-receipt
// @desc    Generate application receipt PDF
// @access  Public
router.post('/application-receipt', generateApplicationReceipt);

// @route   POST /api/pdf/nomination-receipt
// @desc    Generate nomination receipt PDF
// @access  Public
router.post('/nomination-receipt', generateNominationReceipt);

// Admin routes - Bulk exports
// Excel exports
// @route   GET /api/pdf/export-members-excel
// @desc    Export members to Excel
// @access  Private/Admin
router.get('/export-members-excel', protect, admin, exportMembersToExcel);

// @route   GET /api/pdf/export-youth-excel
// @desc    Export youth applications to Excel
// @access  Private/Admin
router.get('/export-youth-excel', protect, admin, exportYouthToExcel);

// @route   GET /api/pdf/export-nominations-excel
// @desc    Export nominations to Excel
// @access  Private/Admin
router.get('/export-nominations-excel', protect, admin, exportNominationsToExcel);

// PDF exports
// @route   GET /api/pdf/export-members-pdf
// @desc    Export members to PDF
// @access  Private/Admin
router.get('/export-members-pdf', protect, admin, exportMembersToPdf);

// @route   GET /api/pdf/export-youth-pdf
// @desc    Export youth applications to PDF
// @access  Private/Admin
router.get('/export-youth-pdf', protect, admin, exportYouthToPdf);

// @route   GET /api/pdf/export-nominations-pdf
// @desc    Export nominations to PDF
// @access  Private/Admin
router.get('/export-nominations-pdf', protect, admin, exportNominationsToPdf);

// Selected members exports
// @route   POST /api/pdf/export-selected-members-excel
// @desc    Export selected members to Excel
// @access  Private/Admin
router.post('/export-selected-members-excel', protect, admin, exportSelectedMembersToExcel);

// @route   POST /api/pdf/export-selected-members-pdf
// @desc    Export selected members to PDF
// @access  Private/Admin
router.post('/export-selected-members-pdf', protect, admin, exportSelectedMembersToPdf);

module.exports = router; 