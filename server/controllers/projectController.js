const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// @desc    Get all upcoming projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  } else {
    // query.status = { $in: ['Planned', 'In Progress'] }; 
  }
  const projects = await Project.find(query).sort({ expectedStartDate: 1, createdAt: -1 });
  res.json(projects);
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  try {
    console.log("Create project request body:", req.body);
    console.log("Create project request files:", req.files);
    
    const { name, hindi_name, description, hindi_description, budget, targetFarms, expectedStartDate, status, location, gallery } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    if (!description) {
      return res.status(400).json({ message: 'Project description is required' });
    }

    if (!budget) {
      return res.status(400).json({ message: 'Project budget is required' });
    }

    if (!targetFarms) {
      return res.status(400).json({ message: 'Target farms is required' });
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
    if (req.files && req.files.gallery) {
      galleryImages = req.files.gallery.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
    }
    
    // Process gallery images from request body
    if (gallery) {
      try {
        // If gallery is a JSON string, parse it
        let galleryData = gallery;
        
        if (typeof gallery === 'string') {
          // Skip processing if it's the invalid "[object Object]" string
          if (gallery === "[object Object]") {
            console.log('Skipping invalid gallery data: [object Object]');
            galleryData = [];
          } else {
            try {
              galleryData = JSON.parse(gallery);
              console.log('Parsed gallery from string:', galleryData);
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
                galleryData = [];
              }
            }
          }
        } else if (gallery === null || gallery === undefined) {
          galleryData = [];
        } else if (!Array.isArray(gallery) && typeof gallery === 'object') {
          // Handle the case when gallery is already an object but not an array
          console.log('Gallery is an object but not an array, converting to array:', gallery);
          galleryData = [gallery]; // Wrap in array
        }
        
        // Ensure galleryData is an array
        if (Array.isArray(galleryData)) {
          // Map gallery items to the correct format and add to galleryImages
          const parsedGalleryImages = galleryData.map(item => {
            // If item is a string URL
            if (typeof item === 'string') {
              return {
                url: item,
                publicId: item.split('/').pop().split('.')[0] // Extract public_id from URL
              };
            }
            // If item is an object with url property
            else if (typeof item === 'object' && item.url) {
              return {
                url: item.url,
                publicId: item.publicId || item.url.split('/').pop().split('.')[0]
              };
            }
            return item;
          });
          
          // Add parsed gallery images to the galleryImages array
          galleryImages = [...galleryImages, ...parsedGalleryImages];
        } else {
          console.log('Gallery data is not an array:', galleryData);
        }
      } catch (error) {
        console.error('Error processing gallery data:', error);
      }
    }

    // If no cover image but we have gallery images, use the first one
    if (!coverImageUrl && galleryImages.length > 0) {
      coverImageUrl = galleryImages[0].url;
      coverImagePublicIdVal = galleryImages[0].publicId;
    }

    const project = new Project({
      createdBy: req.user._id, // Assuming protect middleware adds req.user
      name,
      hindi_name: hindi_name || '',
      description,
      hindi_description: hindi_description || '',
      budget,
      targetFarms,
      expectedStartDate: expectedStartDate ? new Date(expectedStartDate) : undefined,
      status: status || 'Planned',
      location: location || '',
      gallery: galleryImages,
      coverImage: coverImageUrl,
      coverImagePublicId: coverImagePublicIdVal,
    });

    try {
      try {
        const createdProject = await project.save();
        res.status(201).json(createdProject);
      } catch (error) {
        console.error('Error creating project:', error);
        res.status(400).json({ message: 'Error creating project', error: error.message });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ message: 'Error creating project', error: error.message });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      message: error.message || 'An error occurred while creating the project',
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Extract fields from request body
    const { name, hindi_name, description, hindi_description, budget, targetFarms, expectedStartDate, status, location, gallery, imagesToDelete } = req.body;
    
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
          
          // Remove deleted images from project.gallery
          if (project.gallery && project.gallery.length > 0) {
            const deletedUrls = imagesToDeleteArray.map(img => img.url);
            project.gallery = project.gallery.filter(img => !deletedUrls.includes(img.url));
            console.log('Updated gallery after deletions:', project.gallery);
          }
        }
      } catch (error) {
        console.error('Error processing imagesToDelete:', error);
      }
    }

  // Handle cover image update
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    // If there's an old cover image, delete it from Cloudinary
    if (project.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(project.coverImagePublicId);
      } catch (err) {
        console.error('Cloudinary: Error deleting old project cover image:', err);
      }
    }
    
    const coverImageFile = req.files.coverImage[0];
    project.coverImage = coverImageFile.path; // New Cloudinary URL
    project.coverImagePublicId = coverImageFile.filename; // New public_id
  }

  // Handle gallery images update
  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    console.log('New gallery images uploaded:', req.files.gallery);
    const newGalleryImages = req.files.gallery.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    // Keep existing gallery images and add new ones
    // Instead of deleting old images, we'll append the new ones
    project.gallery = [...(project.gallery || []), ...newGalleryImages];
  } else if (gallery) {
    // Handle gallery data from request body
    try {
      console.log('Received gallery data (not files):', gallery);
      
      // If gallery is a JSON string, parse it
      let galleryData = gallery;
      
      if (typeof gallery === 'string') {
        // Skip processing if it's the invalid "[object Object]" string
        if (gallery === "[object Object]") {
          console.log('Skipping invalid gallery data: [object Object]');
          galleryData = [];
        } else {
          try {
            galleryData = JSON.parse(gallery);
            console.log('Parsed gallery from string:', galleryData);
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
              galleryData = project.gallery || [];
            }
          }
        }
      } else if (gallery === null || gallery === undefined) {
        galleryData = [];
      } else if (!Array.isArray(gallery) && typeof gallery === 'object') {
        // Handle the case when gallery is already an object but not an array
        console.log('Gallery is an object but not an array, converting to array:', gallery);
        galleryData = [gallery]; // Wrap in array
      }
      
      // Ensure galleryData is an array
      if (Array.isArray(galleryData)) {
        // Map gallery items to the correct format
        project.gallery = galleryData.map(item => {
          // If item is a string URL
          if (typeof item === 'string') {
            return {
              url: item,
              publicId: item.split('/').pop().split('.')[0] // Extract public_id from URL
            };
          } 
          // If item is an object with url property
          else if (typeof item === 'object' && item.url) {
            return {
              url: item.url,
              publicId: item.publicId || item.url.split('/').pop().split('.')[0]
            };
          }
          return item;
        });
      } else {
        console.log('Gallery data is not an array:', galleryData);
        // Keep existing gallery if data is not in expected format
      }
    } catch (error) {
      console.error('Error processing gallery data:', error);
      // Keep existing gallery if processing fails
    }
  }
  // If no gallery data provided, keep existing gallery

  project.name = name || project.name;
  project.hindi_name = hindi_name || project.hindi_name;
  project.description = description || project.description;
  project.hindi_description = hindi_description || project.hindi_description;
  project.budget = budget || project.budget;
  project.targetFarms = targetFarms || project.targetFarms;
  project.expectedStartDate = expectedStartDate ? new Date(expectedStartDate) : project.expectedStartDate;
  project.status = status || project.status;
  project.location = location || project.location;
  // project.updatedAt is handled by the pre-save hook in the model

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project with ID ${req.params.id}:`, error);
    res.status(500).json({ 
      message: error.message || 'An error occurred while updating the project',
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Delete cover image from Cloudinary if exists
  if (project.coverImagePublicId) {
    try {
      await cloudinary.uploader.destroy(project.coverImagePublicId);
      console.log(`Deleted cover image: ${project.coverImagePublicId}`);
    } catch (err) {
      console.error('Cloudinary: Error deleting project cover image:', err);
    }
  }

  // Delete gallery images from Cloudinary
  if (project.gallery && project.gallery.length > 0) {
    try {
      // Delete images in parallel
      const deletePromises = project.gallery
        .filter(item => item.publicId) // Filter items with public IDs
        .map(item => cloudinary.uploader.destroy(item.publicId));
      
      await Promise.allSettled(deletePromises);
      console.log(`Deleted ${deletePromises.length} gallery images`);
    } catch (err) {
      console.error('Cloudinary: Error deleting project gallery images:', err);
    }
  }

  try {
    // Use a more reliable deletion method
    await Project.deleteOne({ _id: project._id });
    console.log(`Project with ID ${project._id} deleted successfully`);
    
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project from database' });
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
