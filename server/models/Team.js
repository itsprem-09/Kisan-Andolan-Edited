const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required']
  },
  description: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  photo: { // Cloudinary URL of the team member's photo
    type: String,
    required: [true, 'Photo is required']
  },
  photoPublicId: { // Cloudinary public_id for deletion
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Core Team'
  },
  displayOrder: {
    type: Number,
    default: 0 // Used for sorting team members on the frontend
  },
  joinDate: {
    type: Date
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamMemberSchema);
