const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required']
  },
  hindi_name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Program description is required']
  },
  hindi_description: {
    type: String,
    default: ''
  },
  coverImage: { // Cloudinary URL of an image representing the program
    type: String,
    default: ''
  },
  coverImagePublicId: { // Cloudinary public_id for deletion
    type: String,
    default: ''
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  beneficiaries: {
    type: String,
    default: ''
  },
  programDuration: {
    type: String,
    default: ''
  },
  gallery: [{
    url: String,
    publicId: String
  }],
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming', 'Draft'],
    default: 'Upcoming'
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

programSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set coverImage as first gallery image if no coverImage exists
  if (!this.coverImage && this.gallery && this.gallery.length > 0) {
    this.coverImage = this.gallery[0].url;
    this.coverImagePublicId = this.gallery[0].publicId;
  }
  
  next();
});

module.exports = mongoose.model('Program', programSchema);
