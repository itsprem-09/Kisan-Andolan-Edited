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
  const { name, role, description, email, phone } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Photo is required for a team member.');
  }
  const photoUrl = req.file.path; // Cloudinary URL
  const photoPublicIdVal = req.file.filename; // Cloudinary public_id

  const teamMember = new Team({
    name,
    role,
    description,
    email,
    phone,
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
  const { name, role, description, email, phone } = req.body;
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
  teamMember.role = role || teamMember.role;
  teamMember.description = description || teamMember.description;
  teamMember.email = email !== undefined ? email : teamMember.email;
  teamMember.phone = phone !== undefined ? phone : teamMember.phone;

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
