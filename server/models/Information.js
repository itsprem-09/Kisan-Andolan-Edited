const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hindi_title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  hindi_description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['subsidy', 'certification', 'insurance', 'seasonal', 'sustainable', 'weather'],
    default: 'subsidy',
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  region: {
    type: String,
    default: 'national',
  },
  image: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  engagementMetric: {
    type: Number,
    default: 0,
  },
  fileType: {
    type: String,
    enum: ['document', 'image', 'video'],
    default: 'document',
  },
  uploadType: {
    type: String,
    enum: ['Upload File', 'Video Link'],
    default: 'Upload File',
  },
  videoFile: {
    type: String,
  },
});

const InformationGroupSchema = new mongoose.Schema({
  groupTitle: {
    type: String,
    enum: ['governmentSchemes', 'agriculturalResources', 'educationalMaterials', 'newsUpdates'],
    required: true,
    unique: true,
  },
  items: [ItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('InformationGroup', InformationGroupSchema);
