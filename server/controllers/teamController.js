const asyncHandler = require('express-async-handler');
const Team = require('../models/Team');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await Team.find({}).sort({ createdAt: 1 });
  res.json(teamMembers);
});

// @desc    Get a single team member by ID
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = asyncHandler(async (req, res) => {
  const teamMember = await Team.findById(req.params.id);
  if (teamMember) {
    res.json(teamMember);
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private/Admin
const createTeamMember = asyncHandler(async (req, res) => {
  const { 
    name, 
    hindi_name,
    role, 
    hindi_role,
    description, 
    hindi_description,
    email, 
    phone,
    category,
    region,
    isFounder
  } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Photo is required for a team member.');
  }
  const photoUrl = req.file.path; // Cloudinary URL
  const photoPublicIdVal = req.file.filename; // Cloudinary public_id

  const teamMember = new Team({
    name,
    hindi_name: hindi_name || '',
    role,
    hindi_role: hindi_role || '',
    description,
    hindi_description: hindi_description || '',
    email,
    phone,
    category,
    region,
    isFounder: isFounder === 'true' || isFounder === true,
    photo: photoUrl,
    photoPublicId: photoPublicIdVal,
  });

  const createdTeamMember = await teamMember.save();
  res.status(201).json(createdTeamMember);
});

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
const updateTeamMember = asyncHandler(async (req, res) => {
  const { 
    name, 
    hindi_name,
    role, 
    hindi_role,
    bio, 
    description,
    hindi_description,
    email, 
    phone,
    category,
    region,
    isFounder,
    socialMedia 
  } = req.body;
  
  const teamMember = await Team.findById(req.params.id);

  if (!teamMember) {
    res.status(404);
    throw new Error('Team member not found');
  }

  if (req.file) {
    // If there's an old photo, delete it from Cloudinary
    if (teamMember.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(teamMember.photoPublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting old team member photo:', err);
      }
    }
    teamMember.photo = req.file.path; // New Cloudinary URL
    teamMember.photoPublicId = req.file.filename; // New public_id
  }

  teamMember.name = name || teamMember.name;
  teamMember.hindi_name = hindi_name !== undefined ? hindi_name : teamMember.hindi_name;
  teamMember.role = role || teamMember.role;
  teamMember.hindi_role = hindi_role !== undefined ? hindi_role : teamMember.hindi_role;
  
  // Handle description/bio (bio field from form maps to description in DB)
  teamMember.description = bio || description || teamMember.description;
  teamMember.hindi_description = hindi_description !== undefined ? hindi_description : teamMember.hindi_description;
  
  // Handle basic fields
  teamMember.email = email !== undefined ? email : teamMember.email;
  teamMember.phone = phone !== undefined ? phone : teamMember.phone;
  
  // Handle additional fields
  if (category) teamMember.category = category;
  if (region) teamMember.region = region;
  
  // Handle isFounder status (add a new field if needed)
  if (isFounder !== undefined) {
    teamMember.isFounder = isFounder === 'true' || isFounder === true;
  }
  
  // Handle social media links (parse comma-separated string into object)
  if (socialMedia) {
    try {
      const links = socialMedia.split(',').map(link => link.trim());
      
      // Extract social media platform from links
      const socialLinks = {
        linkedin: '',
        twitter: '',
        facebook: ''
      };
      
      links.forEach(link => {
        if (link.includes('linkedin.com')) {
          socialLinks.linkedin = link;
        } else if (link.includes('twitter.com') || link.includes('x.com')) {
          socialLinks.twitter = link;
        } else if (link.includes('facebook.com')) {
          socialLinks.facebook = link;
        }
      });
      
      teamMember.socialLinks = socialLinks;
    } catch (err) {
      console.error('Error parsing social media links:', err);
    }
  }

  const updatedTeamMember = await teamMember.save();
  res.json(updatedTeamMember);
});

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await Team.findById(req.params.id);
  if (teamMember) {
    // Delete the photo from Cloudinary if it exists
    if (teamMember.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(teamMember.photoPublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting team member photo:', err);
      }
    }
    await teamMember.deleteOne();
    res.json({ message: 'Team member removed' });
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
