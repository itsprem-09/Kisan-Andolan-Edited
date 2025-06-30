const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// Generate a unique application ID
const generateApplicationId = async (membershipType) => {
  // Use RKM for General Member and KLP for Kisan Youth Leadership Program
  const prefix = membershipType === 'Kisan Youth Leadership Program' ? 'KLP' : 'RKM';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const applicationId = `${prefix}${timestamp}${random}`;
  
  // Check if this ID already exists (unlikely but possible)
  const exists = await Member.findOne({ applicationId });
  if (exists) {
    // If exists, try again with a different random number
    return generateApplicationId(membershipType);
  }
  
  return applicationId;
};

// @desc    Register a new member
// @route   POST /api/members
// @access  Public
const registerMember = asyncHandler(async (req, res) => {
  const { 
    name, 
    village, 
    city,
    phoneNumber, 
    details,
    membershipType, 
    documentType, 
    age, 
    education, 
    experience 
  } = req.body;

  if (!name || !village || !city || !phoneNumber || !membershipType) {
    res.status(400);
    throw new Error('Please provide all required fields: name, village, phone number, and membership type.');
  }

  console.log(name, city, phoneNumber);
  

  // Additional validation for Youth Leadership Program
  if (membershipType === 'Kisan Youth Leadership Program') {
    if (!age || age < 18 || age > 35) {
      res.status(400);
      throw new Error('Age must be between 18 and 35 years for Youth Leadership Program.');
    }
    
    if (!education) {
      res.status(400);
      throw new Error('Education information is required for Youth Leadership Program.');
    }
  }

  const memberExists = await Member.findOne({ phoneNumber, membershipType });
  if (memberExists) {
    res.status(400);
    throw new Error(`A ${membershipType} application with this phone number already exists.`);
  }

  let documentPhotoUrl = '';
  let documentPublicIdVal = '';

  if (req.file) {
    documentPhotoUrl = req.file.path; // Cloudinary URL
    documentPublicIdVal = req.file.filename; // Cloudinary public_id
  }

  // Generate a unique application ID with the appropriate prefix based on membership type
  const applicationId = await generateApplicationId(membershipType);

  const memberData = {
    name,
    village,
    city,
    phoneNumber,
    details,
    membershipType,
    documentPhoto: documentPhotoUrl,
    documentPublicId: documentPublicIdVal,
    documentType: req.file ? documentType : 'Not Provided',
    isOTPVerified: false,
    status: 'Pending',
    applicationDate: new Date(),
    applicationId
  };

  // Add Youth Leadership Program specific fields if applicable
  if (membershipType === 'Kisan Youth Leadership Program') {
    memberData.age = age;
    memberData.education = education;
    if (experience) memberData.experience = experience;
  }

  const member = new Member(memberData);
  const createdMember = await member.save();
    
  res.status(201).json({
    message: 'Application submitted successfully. OTP verification pending.',
    member: createdMember
  });
});

// @desc    Verify OTP for a member (Placeholder - OTP logic remains)
// @route   POST /api/members/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    res.status(400);
    throw new Error('Phone number and OTP are required');
  }
  
  const member = await Member.findOne({ phoneNumber });
  if (!member) {
    res.status(404);
    throw new Error('Member application not found for this phone number.');
  }

  // For demo purposes, always accept "123456" as a valid OTP
  if (otp === '123456') { 
    member.isOTPVerified = true;
    await member.save();
    res.json({ 
      success: true,
      message: 'OTP verified successfully. Your application is complete.', 
      member 
    });
  } else {
    res.status(400);
    throw new Error('Invalid OTP. For demo purposes, please use 123456.');
  }
});

// @desc    Get all member applications
// @route   GET /api/members
// @access  Private/Admin
const getMemberApplications = asyncHandler(async (req, res) => {
  const members = await Member.find({}).sort({ applicationDate: -1 });
  res.json(members);
});

// @desc    Get a single member application by ID
// @route   GET /api/members/:id
// @access  Private/Admin
const getMemberApplicationById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (member) {
    res.json(member);
  } else {
    res.status(404);
    throw new Error('Member application not found');
  }
});

// @desc    Update a member application
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMemberApplication = asyncHandler(async (req, res) => {
  const { name, village, city, phoneNumber, details, membershipType, documentType, isOTPVerified, status, notes } = req.body;
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Member application not found');
  }

  if (req.file) {
    // If there's an old document, delete it from Cloudinary
    if (member.documentPublicId) {
      try {
        await cloudinary.uploader.destroy(member.documentPublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting old document during update:', err);
      }
    }
    member.documentPhoto = req.file.path; // New Cloudinary URL
    member.documentPublicId = req.file.filename; // New public_id
    member.documentType = documentType || member.documentType; 
  } else if (documentType) {
    member.documentType = documentType; 
  }

  member.name = name || member.name;
  member.village = village || member.village;
  member.city = city || member.city;
  member.phoneNumber = phoneNumber || member.phoneNumber;
  member.details = details || member.details;
  member.membershipType = membershipType || member.membershipType;
  member.isOTPVerified = isOTPVerified !== undefined ? isOTPVerified : member.isOTPVerified;
  
  // Update status if provided and track who made the change
  if (status && member.status !== status) {
    member.status = status;
    member.statusUpdatedAt = Date.now();
    member.statusUpdatedBy = req.user._id;
  }
  
  // Update notes if provided
  if (notes !== undefined) {
    member.notes = notes;
  }

  const updatedMember = await member.save();
  res.json(updatedMember);
});

// @desc    Delete a member application
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMemberApplication = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (member) {
    // Delete the document from Cloudinary if it exists
    if (member.documentPublicId) {
      try {
        await cloudinary.uploader.destroy(member.documentPublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting document:', err);
      }
    }
    await member.deleteOne();
    res.json({ message: 'Member application removed' });
  } else {
    res.status(404);
    throw new Error('Member application not found');
  }
});

module.exports = {
  registerMember,
  verifyOtp,
  getMemberApplications,
  getMemberApplicationById,
  updateMemberApplication,
  deleteMemberApplication,
};
