const asyncHandler = require('express-async-handler');
const Program = require('../models/Program');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
const getPrograms = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  const programs = await Program.find(query).sort({ startDate: -1, createdAt: -1 });
  res.json(programs);
});

// @desc    Get a single program by ID
// @route   GET /api/programs/:id
// @access  Public
const getProgramById = asyncHandler(async (req, res) => {
  console.log(`Fetching program with ID: ${req.params.id}`);
  const program = await Program.findById(req.params.id);
  if (program) {
    console.log('Program found:', {
      id: program._id,
      name: program.name,
      gallery: program.gallery?.length || 0,
      coverImage: !!program.coverImage
    });
    res.json(program);
  } else {
    console.log(`Program with ID ${req.params.id} not found`);
    res.status(404);
    throw new Error('Program not found');
  }
});

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private/Admin
const createProgram = asyncHandler(async (req, res) => {
  try {
    console.log("Create program request body:", req.body);
    console.log("Create program request files:", req.files);
    
    const { name, hindi_name, description, hindi_description, startDate, endDate, status, location, beneficiaries, programDuration, gallery } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Program name is required' });
    }
    
    if (!description) {
      return res.status(400).json({ message: 'Program description is required' });
    }

    let coverImageUrl = '';
    let coverImagePublicIdVal = '';

    // Handle cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const coverImageFile = req.files.coverImage[0];
      coverImageUrl = coverImageFile.path; // Cloudinary URL
      coverImagePublicIdVal = coverImageFile.filename; // Cloudinary public_id
    }

    // Process gallery images from file uploads
    let galleryImages = [];
     if (req.files && req.files.gallery && req.files.gallery.length > 0) {
      console.log(`Processing ${req.files.gallery.length} uploaded gallery files`);
      galleryImages = req.files.gallery.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      console.log('Processed gallery images from file uploads:', galleryImages);
    }
    
    // Process gallery images from request body - THIS PART IS OPTIONAL NOW
    // Since we're now handling file uploads directly, we likely won't need this
    // but keep it as a fallback for backward compatibility
    if (gallery && typeof gallery === 'string' && gallery !== '[object Object]') {
      try {
        // Try to parse as JSON
        let galleryData;
        try {
          galleryData = JSON.parse(gallery);
          console.log('Successfully parsed gallery JSON:', galleryData);
        } catch (parseError) {
          console.error('Not valid JSON, checking for URLs:', parseError);
          // If not JSON, try comma-separated URLs
          if (gallery.includes(',') || gallery.includes('http')) {
            galleryData = gallery.split(',')
              .map(url => url.trim())
              .filter(url => url.length > 0)
              .map(url => ({
                url: url,
                publicId: url.split('/').pop().split('.')[0]
              }));
            console.log('Parsed gallery from comma-separated URLs:', galleryData);
          }
        }
        
        // If we have valid gallery data, add it to galleryImages
        if (Array.isArray(galleryData) && galleryData.length > 0) {
          const parsedGalleryImages = galleryData.map(item => {
            if (typeof item === 'string') {
              return {
                url: item,
                publicId: item.split('/').pop().split('.')[0]
              };
            } else if (item && typeof item === 'object' && item.url) {
              return {
                url: item.url,
                publicId: item.publicId || item.url.split('/').pop().split('.')[0]
              };
            }
            return null;
          }).filter(Boolean);
          
          galleryImages = [...galleryImages, ...parsedGalleryImages];
        }
      } catch (error) {
        console.error('Error processing gallery string data:', error);
      }
    } else if (gallery === '[object Object]') {
      console.log('Received invalid [object Object] gallery string, ignoring it');
    }

    console.log('Final gallery images array:', galleryImages);

    // If no cover image but we have gallery images, use the first one
    if (!coverImageUrl && galleryImages.length > 0) {
      coverImageUrl = galleryImages[0].url;
      coverImagePublicIdVal = galleryImages[0].publicId;
    }

    const program = new Program({
      createdBy: req.user._id, // Assuming protect middleware adds req.user
      name,
      hindi_name: hindi_name || '',
      description,
      hindi_description: hindi_description || '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || 'Upcoming',
      location: location || '',
      beneficiaries: beneficiaries || '',
      programDuration: programDuration || '',
      gallery: galleryImages,
      coverImage: coverImageUrl,
      coverImagePublicId: coverImagePublicIdVal,
    });

    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500);
    throw new Error('Error creating program: ' + error.message);
  }
});

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
const updateProgram = asyncHandler(async (req, res) => {
  const { name, hindi_name, description, hindi_description, startDate, endDate, status, location, beneficiaries, programDuration, gallery, imagesToDelete } = req.body;
  const program = await Program.findById(req.params.id);

  if (!program) {
    res.status(404);
    throw new Error('Program not found');
  }
  
  // Handle images to delete from Cloudinary
  if (imagesToDelete) {
    try {
      const imagesToDeleteArray = JSON.parse(imagesToDelete);
      console.log('Images to delete:', imagesToDeleteArray);
      
      if (Array.isArray(imagesToDeleteArray) && imagesToDeleteArray.length > 0) {
        // Delete images from Cloudinary
        for (const image of imagesToDeleteArray) {
          if (image.publicId) {
            try {
              console.log('Deleting image from Cloudinary:', image.publicId);
              await cloudinary.uploader.destroy(image.publicId);
            } catch (error) {
              console.error('Error deleting image from Cloudinary:', error);
            }
          }
        }
        
        // Remove deleted images from program.gallery
        if (program.gallery && program.gallery.length > 0) {
          const deletedUrls = imagesToDeleteArray.map(img => img.url);
          program.gallery = program.gallery.filter(img => !deletedUrls.includes(img.url));
          console.log('Updated gallery after deletions:', program.gallery);
        }
      }
    } catch (error) {
      console.error('Error processing imagesToDelete:', error);
    }
  }

  // Handle cover image update
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    // If there's an old cover image, delete it from Cloudinary
    if (program.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(program.coverImagePublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting old program cover image:', err);
      }
    }
    
    const coverImageFile = req.files.coverImage[0];
    program.coverImage = coverImageFile.path; // New Cloudinary URL
    program.coverImagePublicId = coverImageFile.filename; // New public_id
  }

  // Check for gallery replacement flags
  const shouldReplaceGallery = req.body.replaceGallery === 'true';
  const shouldClearGallery = req.body.clearGallery === 'true';
  const hasExistingGallery = req.body.existingGallery;
  
  console.log('Gallery update flags:', {
    shouldReplaceGallery,
    shouldClearGallery,
    hasExistingGallery: !!hasExistingGallery
  });
  
  // Handle gallery images update
  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    console.log('New gallery images uploaded:', req.files.gallery);
    const newGalleryImages = req.files.gallery.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    if (shouldReplaceGallery) {
      // Replace all existing gallery images with new ones
      console.log('Replacing entire gallery with new images');
      program.gallery = newGalleryImages;
    } else {
      // Append new images to existing gallery
      console.log('Appending new images to existing gallery');
      program.gallery = [...(program.gallery || []), ...newGalleryImages];
    }
  } else if (gallery) {
    // Handle gallery data from request body
    try {
      console.log('Received gallery data (not files):', gallery);
      
      // Check for existingGallery which takes precedence over gallery
      if (req.body.existingGallery) {
        try {
          const existingGallery = JSON.parse(req.body.existingGallery);
          console.log('Using existingGallery data:', existingGallery);
          program.gallery = existingGallery;
          return; // Skip further gallery processing
        } catch (error) {
          console.error('Error parsing existingGallery:', error);
        }
      }
      
      // If clearGallery flag is set, clear the gallery
      if (shouldClearGallery) {
        console.log('Clearing gallery as requested by clearGallery flag');
        program.gallery = [];
        return; // Skip further gallery processing
      }
      
      // If gallery is a JSON string, parse it
      let galleryData = gallery;
      
      // Handle the common '[object Object]' string issue which is not valid JSON
      if (typeof gallery === 'string' && gallery === "[object Object]") {
        console.log('Received invalid gallery data: [object Object]. Skipping gallery processing.');
        galleryData = [];
      }
      // Handle valid JSON string
      else if (typeof gallery === 'string') {
        try {
          // Try to parse as JSON
          galleryData = JSON.parse(gallery);
          console.log('Successfully parsed gallery JSON:', galleryData);
        } catch (parseError) {
          console.error('Error parsing gallery JSON string:', parseError);
          // Try to handle comma-separated URLs
          if (gallery.includes(',') || gallery.includes('http')) {
            galleryData = gallery.split(',')
              .map(url => url.trim())
              .filter(url => url.length > 0)
              .map(url => ({
                url: url,
                publicId: url.split('/').pop().split('.')[0]
              }));
            console.log('Parsed gallery from comma-separated URLs:', galleryData);
          } else {
            // Keep existing gallery if we can't parse
            console.log('Could not parse gallery string, keeping existing gallery');
            galleryData = program.gallery || [];
          }
        }
      }
      // Handle null/undefined values
      else if (gallery === null || gallery === undefined) {
        console.log('Gallery is null or undefined, keeping existing gallery');
        galleryData = program.gallery || [];
      }
      // Handle non-array objects
      else if (!Array.isArray(gallery) && typeof gallery === 'object') {
        // Check if it's an empty object
        if (Object.keys(gallery).length === 0) {
          console.log('Gallery is an empty object, keeping existing gallery');
          galleryData = program.gallery || [];
        } else {
          console.log('Gallery is an object but not an array, converting to array:', gallery);
          galleryData = [gallery]; // Wrap in array
        }
      }
      
      // Ensure galleryData is an array
      if (Array.isArray(galleryData)) {
        // Map gallery items to the correct format
        program.gallery = galleryData.map(item => {
          // If item is a string URL
          if (typeof item === 'string') {
            return {
              url: item,
              publicId: item.split('/').pop().split('.')[0] // Extract public_id from URL
            };
          } 
          // If item is an object with url property
          else if (item && typeof item === 'object' && item.url) {
            return {
              url: item.url,
              publicId: item.publicId || item.url.split('/').pop().split('.')[0]
            };
          }
          return null;
        }).filter(Boolean); // Remove any null/undefined entries
        
        console.log('Final processed gallery images for update:', program.gallery);
      } else {
        console.log('Gallery data is not an array after processing:', galleryData);
        // Keep existing gallery if data is not in expected format
      }
    } catch (error) {
      console.error('Error processing gallery data:', error);
      // Keep existing gallery if processing fails
    }
  }
  // If no gallery data provided, keep existing gallery

  program.name = name || program.name;
  program.hindi_name = hindi_name || program.hindi_name;
  program.description = description || program.description;
  program.hindi_description = hindi_description || program.hindi_description;
  program.startDate = startDate ? new Date(startDate) : program.startDate;
  program.endDate = endDate ? new Date(endDate) : program.endDate;
  program.status = status || program.status;
  program.location = location || program.location;
  program.beneficiaries = beneficiaries || program.beneficiaries;
  program.programDuration = programDuration || program.programDuration;
  // program.updatedAt is handled by the pre-save hook in the model

  const updatedProgram = await program.save();
  res.json(updatedProgram);
});

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
const deleteProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    res.status(404);
    throw new Error('Program not found');
  }

  // Delete cover image from Cloudinary if exists
  if (program.coverImagePublicId) {
    try {
      await cloudinary.uploader.destroy(program.coverImagePublicId);
      console.log(`Deleted cover image: ${program.coverImagePublicId}`);
    } catch (err) {
      console.error('Cloudinary: Error deleting program cover image:', err);
    }
  }

  // Delete gallery images from Cloudinary
  if (program.gallery && program.gallery.length > 0) {
    try {
      // Delete images in parallel
      const deletePromises = program.gallery
        .filter(item => item.publicId) // Filter items with public IDs
        .map(item => cloudinary.uploader.destroy(item.publicId));
      
      await Promise.allSettled(deletePromises);
      console.log(`Deleted ${deletePromises.length} gallery images`);
    } catch (err) {
      console.error('Cloudinary: Error deleting program gallery images:', err);
    }
  }

  try {
    // Use a more reliable deletion method
    await Program.deleteOne({ _id: program._id });
    console.log(`Program with ID ${program._id} deleted successfully`);
    
    res.json({ message: 'Program removed successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Failed to delete program from database' });
  }
});

module.exports = {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};
