const Vision = require('../models/Vision');
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get the vision and mission statement
// @route   GET /api/vision
// @access  Public
exports.getVision = async (req, res) => {
  try {
    const vision = await Vision.findOne();
    res.status(200).json({ success: true, data: vision });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create or Update the vision and mission statement
// @route   POST /api/vision
// @access  Private/Admin
exports.createOrUpdateVision = async (req, res) => {
  try {
    let vision = await Vision.findOne();
    const { title, description, status } = req.body;
    const updatedData = { title, description, status };

    if (req.file) {
      if (vision && vision.imagePublicId) {
        await cloudinary.uploader.destroy(vision.imagePublicId);
      }
      updatedData.imageUrl = req.file.path;
      updatedData.imagePublicId = req.file.filename;
    }

    if (vision) {
      // Update existing document
      vision = await Vision.findByIdAndUpdate(vision._id, updatedData, { new: true, runValidators: true });
    } else {
      // Create new document
      vision = await Vision.create(updatedData);
    }

    res.status(200).json({ success: true, data: vision });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
