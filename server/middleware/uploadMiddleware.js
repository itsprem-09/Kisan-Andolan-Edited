const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../tmp/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage for temporary files
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Init upload using disk storage for more reliable file handling
const upload = multer({
  storage: diskStorage, // Use disk storage instead of Cloudinary storage
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (more reasonable for web uploads)
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
});

// For direct Cloudinary storage if needed
const cloudinaryUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    console.log("Processing file upload for Cloudinary:", file.originalname);

    const allowedMimetypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/mpeg', 'video/x-msvideo',
      'application/pdf'
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.pdf'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (allowedMimetypes.includes(file.mimetype) && allowedExtensions.includes(extname)) {
      return cb(null, true);
    }

    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
}).fields([
  { name: 'gallery', maxCount: 10 },
  { name: 'mediafile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Middleware for single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple files upload
const uploadMultiple = (fieldNames) => {
  const fields = fieldNames.map(name => ({
    name,
    maxCount: name === 'gallery' ? 10 : 1 // Allow up to 10 images for gallery, 1 for other fields
  }));
  return upload.fields(fields);
};

// Middleware for multiple fields with different names (used for main file + thumbnail)
const uploadFields = (fields) => upload.fields(fields);

// Middleware to process Cloudinary uploads properly
const processCloudinaryUploads = (req, res, next) => {
  // Fields we expect to contain file uploads
  const fileFields = ['gallery', 'mediafile', 'thumbnail', 'coverImage', 'image', 'photo', 'video'];

  console.log('processCloudinaryUploads middleware called');

  if (req.files) {
    console.log('Files received in middleware:', Object.keys(req.files).join(', '));

    // Process each field of uploaded files
    fileFields.forEach(field => {
      if (req.files[field]) {
        console.log(`Processing ${field} files:`,
          req.files[field].map(f => ({
            name: f.originalname,
            path: f.path,
            size: f.size,
            cloudinary: f.secure_url ? true : false
          })));
          
        // Ensure each file has both path and filename properly set
        req.files[field].forEach(file => {
          // Check file size for video uploads
          if (field === 'video' && file.size > 10 * 1024 * 1024) {
            throw new Error('Video file size should be less than 10MB. Please upload a smaller file or provide a video link instead.');
          }
          
          // If using Cloudinary, ensure consistent property naming
          if (!file.fileName && file.filename) {
            file.fileName = file.filename;
          }
          
          if (!file.fileName && file.public_id) {
            file.fileName = file.public_id;
          }
          
          // If path is not set, use secure_url if available
          if (!file.path && file.secure_url) {
            file.path = file.secure_url;
          }
          
          // If neither path nor secure_url is available, construct a fallback path
          if (!file.path && file.public_id) {
            // Construct a URL from public_id
            const folderPath = file.public_id.split('/').slice(0, -1).join('/');
            const filename = file.public_id.split('/').pop();
            file.path = `https://res.cloudinary.com/dchdfbknt/${file.resource_type || 'image'}/upload/${folderPath ? folderPath + '/' : ''}${filename}`;
          }
          
          console.log(`Processed file ${file.originalname}:`, {
            fileName: file.fileName || file.filename || file.public_id,
            path: file.path || file.secure_url,
            size: file.size || 'unknown'
          });
        });
      }
    });
  }
  next();
};

// Custom error handler for Multer errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File size should be less than 10MB. Please upload a smaller file or provide a video link instead.'
      });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  
  next();
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  cloudinaryUpload,
  processCloudinaryUploads,
  handleUploadErrors
};


