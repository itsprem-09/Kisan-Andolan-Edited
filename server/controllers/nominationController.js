const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const Nomination = require('../models/Nomination');
const { cloudinaryUploadImage } = require('../config/cloudinaryConfig');
const { sendNominationEmail } = require('../utils/emailService');

// @desc    Submit a new nomination
// @route   POST /api/nominations
// @access  Public
const submitNomination = asyncHandler(async (req, res) => {
  try {
    console.log('Nomination submission request received');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Enhanced debugging for file uploads
    if (req.files) {
      console.log('Files received:');
      Object.keys(req.files).forEach(key => {
        const files = req.files[key];
        console.log(`${key}: ${files.length} files`);
        files.forEach((file, idx) => {
          console.log(`  - ${idx}: ${file.originalname}, ${file.path}, ${file.size} bytes`);
        });
      });
    } else {
      console.log('No files received in the request');
    }
    
    const {
      nomineeName,
      nomineeAge,
      nomineeGender,
      district,
      state,
      occupation,
      contribution,
      nominatorName,
      nominatorMobile,
      nominatorEmail,
      additionalDocumentType,
      additionalDocumentUrl,
      // New fields for Cloudinary URLs
      aadharCardUrl,
      aadharCardPublicId,
      photographUrl,
      photographPublicId,
      additionalDocumentPublicId
    } = req.body;
    
    // Validate required fields
    if (!nomineeName || !district || !state || !occupation || !nominatorName || !nominatorMobile) {
      console.error('Missing required fields');
      res.status(400);
      throw new Error('Please fill all required fields');
    }
    
    // Default file paths
    let aadharCardPath = '';
    let photographPath = '';
    let additionalDocumentPath = '';
    
    console.log('Checking for aadhar card file or URL...');
    // Check if we have Cloudinary URLs or need to process files
    if (aadharCardUrl) {
      // Use the provided Cloudinary URL directly
      console.log('Using provided Cloudinary URL for aadhar card:', aadharCardUrl);
      aadharCardPath = aadharCardUrl;
    } else if (req.files && req.files.aadharCard && req.files.aadharCard.length > 0) {
      // Upload to Cloudinary if we have a file
      console.log('Uploading aadharCard to Cloudinary...');
      try {
        const aadharFile = req.files.aadharCard[0];
        console.log('Aadhar file found:', aadharFile.originalname, aadharFile.path);
        const cloudinaryResult = await cloudinaryUploadImage(aadharFile.path, 'nominations');
        aadharCardPath = cloudinaryResult.secure_url;
        console.log('Aadhar card uploaded successfully:', aadharCardPath);
      } catch (uploadError) {
        console.error('Error uploading aadhar card to Cloudinary:', uploadError);
        if (req.files.aadharCard[0].path) {
          aadharCardPath = req.files.aadharCard[0].path; // Fallback to local path
          console.log('Using local path as fallback:', aadharCardPath);
        } else {
          res.status(400);
          throw new Error('Aadhar Card document is required');
        }
      }
    } else {
      console.error('Missing aadharCard file or URL');
      console.log('req.files available keys:', req.files ? Object.keys(req.files) : 'none');
      console.log('req.body keys:', Object.keys(req.body));
      
      // Check for string representation of file object which would indicate serialization issue
      if (req.body.aadharCard && typeof req.body.aadharCard === 'string' && 
          req.body.aadharCard.includes('[object Object]')) {
        console.error('Found [object Object] for aadharCard - indicates a file serialization issue');
        res.status(400);
        throw new Error('File upload issue: please try again with valid image files');
      } else {
        res.status(400);
        throw new Error('Aadhar Card document is required');
      }
    }
    
    console.log('Checking for photograph file or URL...');
    if (photographUrl) {
      // Use the provided Cloudinary URL directly
      console.log('Using provided Cloudinary URL for photograph:', photographUrl);
      photographPath = photographUrl;
    } else if (req.files && req.files.photograph && req.files.photograph.length > 0) {
      // Upload to Cloudinary if we have a file
      console.log('Uploading photograph to Cloudinary...');
      try {
        const photoFile = req.files.photograph[0];
        console.log('Photograph file found:', photoFile.originalname, photoFile.path);
        const cloudinaryResult = await cloudinaryUploadImage(photoFile.path, 'nominations');
        photographPath = cloudinaryResult.secure_url;
        console.log('Photograph uploaded successfully:', photographPath);
      } catch (uploadError) {
        console.error('Error uploading photograph to Cloudinary:', uploadError);
        if (req.files.photograph[0].path) {
          photographPath = req.files.photograph[0].path; // Fallback to local path
          console.log('Using local path as fallback:', photographPath);
        } else {
          res.status(400);
          throw new Error('Photograph is required');
        }
      }
    } else {
      console.error('Missing photograph file or URL');
      
      // Check for string representation of file object which would indicate serialization issue
      if (req.body.photograph && typeof req.body.photograph === 'string' && 
          req.body.photograph.includes('[object Object]')) {
        console.error('Found [object Object] for photograph - indicates a file serialization issue');
        res.status(400);
        throw new Error('File upload issue: please try again with valid image files');
      } else {
        res.status(400);
        throw new Error('Photograph is required');
      }
    }
    
    // Handle optional additional document - could be URL or file
    if (additionalDocumentUrl && additionalDocumentType) {
      // Use provided Cloudinary URL or external URL
      console.log('Using provided URL for additional document:', additionalDocumentUrl);
      additionalDocumentPath = additionalDocumentUrl;
    } else if (req.files && req.files.additionalDocument && req.files.additionalDocument[0]) {
      // Upload to Cloudinary if we have a file
      console.log('Uploading additional document to Cloudinary...');
      try {
        const additionalFile = req.files.additionalDocument[0];
        const cloudinaryResult = await cloudinaryUploadImage(additionalFile.path, 'nominations');
        additionalDocumentPath = cloudinaryResult.secure_url;
        console.log('Additional document uploaded successfully:', additionalDocumentPath);
      } catch (uploadError) {
        console.error('Error uploading additional document to Cloudinary:', uploadError);
        if (req.files.additionalDocument[0].path) {
          additionalDocumentPath = req.files.additionalDocument[0].path; // Fallback to local path
        }
      }
    }
    
    // Generate reference number manually if we're having issues with the pre-save hook
    const year = new Date().getFullYear();
    const latestNomination = await Nomination.findOne({
      referenceNumber: { $regex: `RKM-VPGP-${year}-` }
    }).sort({ referenceNumber: -1 });
    
    let sequenceNumber = 1001; // Start with 1001
    if (latestNomination) {
      const parts = latestNomination.referenceNumber.split('-');
      const lastSequence = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastSequence)) {
        sequenceNumber = lastSequence + 1;
      }
    }
    
    const referenceNumber = `RKM-VPGP-${year}-${sequenceNumber}`;
    console.log(`Generated reference number: ${referenceNumber}`);
    
    // Create nomination entry
    const nominationData = {
      nomineeName,
      nomineeAge: nomineeAge ? Number(nomineeAge) : undefined,
      nomineeGender,
      district,
      state,
      occupation,
      contribution,
      nominatorName,
      nominatorMobile,
      nominatorEmail,
      aadharCardPath,
      photographPath,
      additionalDocumentPath,
      additionalDocumentType: additionalDocumentType || 'none',
      additionalDocumentUrl: additionalDocumentType === 'video_url' ? additionalDocumentUrl : undefined,
      referenceNumber, // Explicitly set the reference number
      sector: determineSector(occupation)
    };
    
    console.log('Creating nomination with data:', nominationData);
    const nomination = await Nomination.create(nominationData);
    
    if (nomination) {
      console.log('Nomination created successfully:', nomination._id);
      res.status(201).json({
        success: true,
        message: 'Nomination submitted successfully',
        nomination: {
          id: nomination._id,
          referenceNumber: nomination.referenceNumber,
          nomineeName: nomination.nomineeName,
          nomineeAge: nomination.nomineeAge,
          nomineeGender: nomination.nomineeGender,
          district: nomination.district,
          state: nomination.state,
          occupation: nomination.occupation,
          contribution: nomination.contribution,
          nominatorName: nomination.nominatorName,
          nominatorMobile: nomination.nominatorMobile,
          nominatorEmail: nomination.nominatorEmail,
          status: nomination.status,
          createdAt: nomination.createdAt
        }
      });

      // Add this code for email notification
      try {
        await sendNominationEmail(nomination);
      } catch (emailError) {
        console.error('Error sending nomination email notification:', emailError);
        // Don't fail the nomination process if email fails
      }
    } else {
      // Clean up uploaded files if nomination creation fails - only needed for local files
      try {
        // Only clean up local files, not Cloudinary URLs
        if (aadharCardPath && aadharCardPath.startsWith('/') && fs.existsSync(aadharCardPath)) {
          fs.unlinkSync(aadharCardPath);
        }
        if (photographPath && photographPath.startsWith('/') && fs.existsSync(photographPath)) {
          fs.unlinkSync(photographPath);
        }
        if (additionalDocumentPath && additionalDocumentPath.startsWith('/') && fs.existsSync(additionalDocumentPath)) {
          fs.unlinkSync(additionalDocumentPath);
        }
      } catch (error) {
        console.error('Error cleaning up files:', error);
      }
      
      console.error('Failed to create nomination');
      res.status(500);
      throw new Error('Failed to create nomination');
    }
  } catch (error) {
    console.error('Error in submitNomination:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
    }
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error submitting nomination'
      });
    }
  }
});

// @desc    Get all nominations (with filtering options)
// @route   GET /api/nominations
// @access  Private/Admin
const getNominations = asyncHandler(async (req, res) => {
  // Build filter object from query parameters
  const filters = {};
  
  if (req.query.district) {
    filters.district = req.query.district;
  }
  
  if (req.query.state) {
    filters.state = req.query.state;
  }
  
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  if (req.query.sector) {
    filters.sector = req.query.sector;
  }
  
  if (req.query.year) {
    filters.year = parseInt(req.query.year);
  }
  
  // Get paginated results
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const nominations = await Nomination.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Nomination.countDocuments(filters);
  
  res.json({
    success: true,
    count: nominations.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    nominations
  });
});

// @desc    Get nomination by ID
// @route   GET /api/nominations/:id
// @access  Private/Admin
const getNominationById = asyncHandler(async (req, res) => {
  const nomination = await Nomination.findById(req.params.id);
  
  if (nomination) {
    res.json({
      success: true,
      nomination
    });
  } else {
    res.status(404);
    throw new Error('Nomination not found');
  }
});

// @desc    Get nomination by reference number
// @route   GET /api/nominations/reference/:referenceNumber
// @access  Public
const getNominationByReference = asyncHandler(async (req, res) => {
  const nomination = await Nomination.findOne({ referenceNumber: req.params.referenceNumber });
  
  if (nomination) {
    // Return limited information for public access
    res.json({
      success: true,
      nomination: {
        referenceNumber: nomination.referenceNumber,
        nomineeName: nomination.nomineeName,
        district: nomination.district,
        state: nomination.state,
        status: nomination.status,
        createdAt: nomination.createdAt
      }
    });
  } else {
    res.status(404);
    throw new Error('Nomination not found');
  }
});

// @desc    Update nomination status
// @route   PUT /api/nominations/:id
// @access  Private/Admin
const updateNominationStatus = asyncHandler(async (req, res) => {
  const { status, reviewNotes } = req.body;
  
  if (!status || !['New', 'In Review', 'Shortlisted', 'Awarded', 'Rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  
  const nomination = await Nomination.findById(req.params.id);
  
  if (nomination) {
    nomination.status = status;
    if (reviewNotes) {
      nomination.reviewNotes = reviewNotes;
    }
    
    // If status is being updated to In Review, assign the current user as reviewer
    if (status === 'In Review' && req.user) {
      nomination.assignedReviewer = req.user._id;
    }
    
    const updatedNomination = await nomination.save();
    
    res.json({
      success: true,
      message: 'Nomination status updated successfully',
      nomination: updatedNomination
    });
  } else {
    res.status(404);
    throw new Error('Nomination not found');
  }
});

// @desc    Delete a nomination
// @route   DELETE /api/nominations/:id
// @access  Private/Admin
const deleteNomination = asyncHandler(async (req, res) => {
  const nomination = await Nomination.findById(req.params.id);
  
  if (!nomination) {
    res.status(404);
    throw new Error('Nomination not found');
  }
  
  // Clean up associated files
  try {
    // Only delete if file exists and is within our uploads directory
    if (nomination.aadharCardPath && fs.existsSync(nomination.aadharCardPath) && 
        nomination.aadharCardPath.includes('uploads')) {
      fs.unlinkSync(nomination.aadharCardPath);
    }
    
    if (nomination.photographPath && fs.existsSync(nomination.photographPath) && 
        nomination.photographPath.includes('uploads')) {
      fs.unlinkSync(nomination.photographPath);
    }
    
    if (nomination.additionalDocumentPath && fs.existsSync(nomination.additionalDocumentPath) && 
        nomination.additionalDocumentPath.includes('uploads')) {
      fs.unlinkSync(nomination.additionalDocumentPath);
    }
  } catch (error) {
    console.error('Error deleting nomination files:', error);
    // Continue with deletion even if file removal fails
  }
  
  await nomination.remove();
  
  res.json({
    success: true,
    message: 'Nomination deleted successfully'
  });
});

// @desc    Get nomination statistics
// @route   GET /api/nominations/stats
// @access  Private/Admin
const getNominationStats = asyncHandler(async (req, res) => {
  // Get total counts by status
  const statusCounts = await Nomination.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Get counts by state
  const stateCounts = await Nomination.aggregate([
    { $group: { _id: '$state', count: { $sum: 1 } } }
  ]);
  
  // Get counts by sector
  const sectorCounts = await Nomination.aggregate([
    { $group: { _id: '$sector', count: { $sum: 1 } } }
  ]);
  
  // Format the data for frontend consumption
  const statusStats = {};
  statusCounts.forEach(item => {
    statusStats[item._id] = item.count;
  });
  
  const stateStats = {};
  stateCounts.forEach(item => {
    stateStats[item._id] = item.count;
  });
  
  const sectorStats = {};
  sectorCounts.forEach(item => {
    sectorStats[item._id] = item.count;
  });
  
  res.json({
    success: true,
    totalNominations: await Nomination.countDocuments(),
    statusStats,
    stateStats,
    sectorStats
  });
});

// Helper function to determine sector based on occupation
const determineSector = (occupation) => {
  occupation = occupation.toLowerCase();
  
  if (occupation.includes('farm') || occupation === 'farmer') {
    return 'Agriculture';
  } else if (occupation.includes('teach') || occupation.includes('educat') || 
             occupation.includes('professor') || occupation === 'rural educator') {
    return 'Education';
  } else if (occupation.includes('social') || occupation === 'social worker') {
    return 'Social Work';
  } else if (occupation.includes('rural') || occupation.includes('village') || 
             occupation.includes('community')) {
    return 'Rural Development';
  } else {
    return 'Other';
  }
};

// @desc    Get count of filtered nominations
// @route   GET /api/nominations/filtered-count
// @access  Private/Admin
const getFilteredNominationCount = asyncHandler(async (req, res) => {
  // Build filter object from query parameters
  const filters = {};
  
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  if (req.query.sector) {
    filters.sector = req.query.sector;
  }
  
  if (req.query.district) {
    filters.district = req.query.district;
  }
  
  if (req.query.state) {
    filters.state = req.query.state;
  }
  
  // Date filtering
  if (req.query.startDate || req.query.endDate) {
    filters.createdAt = {};
    
    if (req.query.startDate) {
      filters.createdAt.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      // Add one day to include the end date fully
      const endDate = new Date(req.query.endDate);
      endDate.setDate(endDate.getDate() + 1);
      filters.createdAt.$lte = endDate;
    }
  }
  
  const count = await Nomination.countDocuments(filters);
  
  res.json({
    success: true,
    count,
    filters
  });
});

module.exports = {
  submitNomination,
  getNominations,
  getNominationById,
  getNominationByReference,
  updateNominationStatus,
  deleteNomination,
  getNominationStats,
  getFilteredNominationCount
}; 