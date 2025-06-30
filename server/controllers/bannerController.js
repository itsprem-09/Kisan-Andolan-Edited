const Banner = require('../models/banner');
const { cloudinaryDeleteImage } = require('../config/cloudinaryConfig');

const createBanner = async (req, res) => {
  try {
    const files = req.files;
    const savedBanners = [];

    for (let field in files) {
      for (let file of files[field]) {
        savedBanners.push(await Banner.create({
          url: file.path,
          public_id: file.filename,
          field,
        }));
      }
    }

    res.status(201).json({ success: true, Banners: savedBanners });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBanners = async (req, res) => {
  try {
    const Banners = await Banner.find().sort({ uploadedAt: -1 });
    res.json(Banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editBanner = async (req, res) => {
  const { public_id } = req.params;

  try {
    const oldBanner = await Banner.findOne({ public_id: req.params.public_id });
    if (!oldBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Destroy old image from Cloudinary
    await cloudinaryDeleteImage(req.params.public_id);

    // the new uploaded file (supports multiple field names)
    const uploadedField = Object.keys(req.files || {})[0];
    const newFile = uploadedField ? req.files[uploadedField][0] : null;

    if (!newFile) {
      return res.status(400).json({ message: 'No new image uploaded' });
    }

    // Update MongoDB doc
    oldBanner.url = newFile.path;
    oldBanner.public_id = newFile.filename;
    await oldBanner.save();

    res.json({ message: 'Banner updated successfully', banner: oldBanner });
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ message: err.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ public_id: req.params.public_id });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // ✅ Delete from Cloudinary using your helper
    await cloudinaryDeleteImage(req.params.public_id);

    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createBanner,
    getBanners,
    editBanner,
    deleteBanner
}