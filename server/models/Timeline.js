const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  hindi_title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  hindi_description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  gallery: [{
    filePath: String,
    publicId: String,
    fileType: String
  }],
  isKeyMilestone: {
    type: Boolean,
    default: false
  },
  impact: {
    type: String,
    trim: true
  },
  hindi_impact: {
    type: String,
    trim: true
  },
  achievement: {
    type: String,
    enum: ["", "Debt Relief Assistance", "Organic Farming Training", "Access to Agricultural Equipment", "Farmer Market Linkage Programs", "Crop Insurance Enrollment Drive", "Children's Education Support", "Water Conservation & Irrigation Projects", "Rural Health Camps & Mental Health Support"],
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline; 