const mongoose = require('mongoose');

// This model represents 'Upcoming Projects'
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required']
  },
  hindi_name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  hindi_description: {
    type: String,
    default: ''
  },
  budget: {
    type: String,
    required: [true, 'Project budget is required']
  },
  targetFarms: {
    type: String,
    required: [true, 'Target farms is required']
  },
  coverImage: { // Cloudinary URL of an image representing the project
    type: String,
    default: ''
  },
  coverImagePublicId: { // Cloudinary public_id for deletion
    type: String,
    default: ''
  },
  gallery: [{
    url: String,
    publicId: String
  }],
  expectedStartDate: {
    type: Date
  },
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'Draft'],
    default: 'Planned'
  },
  // relatedMedia: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Media'
  // }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set coverImage as first gallery image if no coverImage exists
  if (!this.coverImage && this.gallery && this.gallery.length > 0) {
    this.coverImage = this.gallery[0].url;
    this.coverImagePublicId = this.gallery[0].publicId;
  }
  
  next();
});

module.exports = mongoose.model('Project', projectSchema);
