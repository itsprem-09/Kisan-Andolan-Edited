const mongoose = require('mongoose');

const VisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    default: 'Our Vision & Mission'
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  imageUrl: {
    type: String,
    required: false, 
  },
  imagePublicId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  }
}, { timestamps: true });

// Ensure only one document can be created for Vision & Mission
VisionSchema.pre('save', async function (next) {
  const count = await mongoose.model('Vision').countDocuments();
  if (count > 0 && this.isNew) {
    next(new Error('Only one Vision & Mission document can be created.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Vision', VisionSchema);
