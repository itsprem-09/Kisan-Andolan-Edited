const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  field: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
