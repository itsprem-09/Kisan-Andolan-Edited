const mongoose = require('mongoose');

const AndolanSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Year is required.'],
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  imageUrl: {
    type: String,
    required: false, // Not every timeline event may have an image
  },
  imagePublicId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, { timestamps: true });

module.exports = mongoose.model('Andolan', AndolanSchema);
