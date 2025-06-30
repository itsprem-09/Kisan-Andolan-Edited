const InformationGroup = require('../models/Information'); // updated model
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get all information groups
// @route   GET /api/information
// @access  Public
exports.getInformationItems = async (req, res) => {
  try {
    const groups = await InformationGroup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create an item inside a group
// @route   POST /api/information/:groupTitle
// @access  Private/Admin
exports.createInformationItem = async (req, res) => {
  try {
    const {
      groupTitle,
      title,
      hindi_title,
      description,
      hindi_description,
      category,
      region,
      engagementMetric,
      fileType,
      uploadType,
      videoUrl
    } = req.body;

    console.log('Creating information item with:', { 
      fileType, 
      uploadType, 
      videoUrl, 
      files: req.files ? Object.keys(req.files) : 'none' 
    });

    // Only get image from request if it exists
    const image = req.files?.image?.[0]?.path || null;
    // Get video file if it exists
    const videoFile = req.files?.video?.[0]?.path || null;

    let group = await InformationGroup.findOne({ groupTitle });

    // Create the new item object with all fields
    const newItem = {
      title,
      hindi_title: hindi_title || '',
      description,
      hindi_description: hindi_description || '',
      category,
      region,
      image,
      engagementMetric,
      fileType,
    };

    // For video file type, handle both uploadType options
    if (fileType === 'video') {
      // Add uploadType to the item
      newItem.uploadType = uploadType || 'Upload File';
      
      if (uploadType === 'Video Link' && videoUrl) {
        // If upload type is Video Link, add the URL
        newItem.videoUrl = videoUrl;
      } else if (uploadType === 'Upload File' && videoFile) {
        // If upload type is Upload File, add the file path
        newItem.videoFile = videoFile;
      }
    }

    if (!group) {
      // create the group if it doesn't exist
      group = await InformationGroup.create({
        groupTitle,
        items: [newItem],
      });
    } else {
      // push to existing group's items
      group.items.push(newItem);
      await group.save();
    }

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    console.error('Error creating information item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an item inside a group
// @route   PUT /api/information/:groupTitle/:itemId
// @access  Private/Admin
exports.updateInformationItem = async (req, res) => {
  try {
    const { groupTitle, id: itemId } = req.params;
    const updatedFields = { ...req.body };

    console.log('Updating information item with:', { 
      fileType: updatedFields.fileType, 
      uploadType: updatedFields.uploadType,
      videoUrl: updatedFields.videoUrl,
      files: req.files ? Object.keys(req.files) : 'none' 
    });

    const group = await InformationGroup.findOne({ groupTitle });
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    const itemIndex = group.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Item not found in group' });
    }

    // Handle image field if provided
    if (req.files?.image?.[0]?.path) {
      updatedFields.image = req.files.image[0].path;
    }

    // Handle video file if provided
    if (req.files?.video?.[0]?.path) {
      updatedFields.videoFile = req.files.video[0].path;
    }

    // For video file type, handle both uploadType options
    if (updatedFields.fileType === 'video') {
      // Add uploadType to the item
      if (updatedFields.uploadType === 'Video Link') {
        // If upload type is Video Link, use the URL
        if (!updatedFields.videoUrl) {
          // If no videoUrl is provided, keep the existing one
          updatedFields.videoUrl = group.items[itemIndex].videoUrl;
        }
        // Clear videoFile if it exists
        updatedFields.videoFile = undefined;
      } else if (updatedFields.uploadType === 'Upload File') {
        // If upload type is Upload File, clear videoUrl
        updatedFields.videoUrl = undefined;
        // Keep existing videoFile if no new one is provided
        if (!updatedFields.videoFile && !req.files?.video) {
          updatedFields.videoFile = group.items[itemIndex].videoFile;
        }
      }
    } else {
      // If not a video, remove video related fields
      updatedFields.videoUrl = undefined;
      updatedFields.videoFile = undefined;
      updatedFields.uploadType = undefined;
    }

    group.items[itemIndex] = {
      ...group.items[itemIndex]._doc,
      ...updatedFields,
    };

    await group.save();
    res.status(200).json({ success: true, data: group.items[itemIndex] });
  } catch (error) {
    console.error('Error updating information item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an item inside a group
// @route   DELETE /api/information/:groupTitle/:itemId
// @access  Private/Admin
// DELETE /api/information/:groupTitle/:itemId
exports.deleteInformationItem = async (req, res) => {
  try {
    const { groupTitle, id:itemId } = req.params;

    const group = await InformationGroup.findOne({ groupTitle });
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    console.log('Requested itemId:', itemId);
    console.log('All item._id in group:', group.items.map(i => i._id.toString()));


    const item = group.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found in group' });
    }

    // delete image from Cloudinary
    // if (group.items[itemIndex].imagePublicId) {
    //   await cloudinary.uploader.destroy(group.items[itemIndex].imagePublicId);
    // }

    item.deleteOne(); // removes the subdocument
    await group.save();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


