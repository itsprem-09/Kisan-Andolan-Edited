const PartnerInquiry = require('../models/PartnerInquiry');
const asyncHandler = require('express-async-handler');

// @desc    Create a new partnership inquiry
// @route   POST /api/partnership-inquiries
// @access  Public
const createPartnerInquiry = asyncHandler(async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }
    
    // Create new inquiry
    const inquiry = await PartnerInquiry.create({
      name,
      email,
      organization: organization || '',
      message,
      status: 'New'
    });
    
    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error creating partnership inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create partnership inquiry',
      error: error.message
    });
  }
});

// @desc    Get all partnership inquiries
// @route   GET /api/partnership-inquiries
// @access  Private/Admin
const getPartnerInquiries = asyncHandler(async (req, res) => {
  try {
    // Get inquiries, newest first
    const inquiries = await PartnerInquiry.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching partnership inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partnership inquiries',
      error: error.message
    });
  }
});

// @desc    Update partnership inquiry status
// @route   PUT /api/partnership-inquiries/:id
// @access  Private/Admin
const updatePartnerInquiry = asyncHandler(async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // Find and update the inquiry
    const inquiry = await PartnerInquiry.findByIdAndUpdate(
      req.params.id,
      { 
        status: status || 'New',
        notes: notes || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Partnership inquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating partnership inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partnership inquiry',
      error: error.message
    });
  }
});

// @desc    Delete partnership inquiry
// @route   DELETE /api/partnership-inquiries/:id
// @access  Private/Admin
const deletePartnerInquiry = asyncHandler(async (req, res) => {
  try {
    const inquiry = await PartnerInquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Partnership inquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting partnership inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partnership inquiry',
      error: error.message
    });
  }
});

module.exports = {
  createPartnerInquiry,
  getPartnerInquiries,
  updatePartnerInquiry,
  deletePartnerInquiry
}; 