const Andolan = require('../models/Andolan');
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get all andolan events
// @route   GET /api/andolan
// @access  Public
exports.getAndolanEvents = async (req, res) => {
  try {
    const events = await Andolan.find().sort({ year: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create an andolan event
// @route   POST /api/andolan
// @access  Private/Admin
exports.createAndolanEvent = async (req, res) => {
  try {
    const { year, title, description, status } = req.body;
    let imageUrl, imagePublicId;

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const event = await Andolan.create({
      year,
      title,
      description,
      status,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an andolan event
// @route   PUT /api/andolan/:id
// @access  Private/Admin
exports.updateAndolanEvent = async (req, res) => {
  try {
    let event = await Andolan.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const updatedData = { ...req.body };

    if (req.file) {
      // If there's an old image, delete it from Cloudinary
      if (event.imagePublicId) {
        await cloudinary.uploader.destroy(event.imagePublicId);
      }
      updatedData.imageUrl = req.file.path;
      updatedData.imagePublicId = req.file.filename;
    }

    event = await Andolan.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an andolan event
// @route   DELETE /api/andolan/:id
// @access  Private/Admin
exports.deleteAndolanEvent = async (req, res) => {
  try {
    const event = await Andolan.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Delete image from Cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    await event.deleteOne(); // Changed from .remove() which is deprecated

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
