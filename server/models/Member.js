const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  village: {
    type: String,
    required: [true, 'Village is required']
  },
  city: {
    type: String,
    required: [true, 'city is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true, // Assuming phone numbers should be unique
    // Add validation for phone number format if needed
  },
  details: String,
  isOTPVerified: {
    type: Boolean,
    default: false
  },
  documentPhoto: {
    type: String, // Cloudinary URL of the uploaded document
    default: ''
  },
  documentPublicId: {
    type: String, // Cloudinary public_id for deletion
    default: ''
  },
  documentType: {
    type: String,
    enum: ['Aadhaar', 'PAN', 'Ration Card', 'Other', 'Not Provided'],
    default: 'Not Provided'
  },
  membershipType: {
    type: String,
    enum: ['General Member', 'Kisan Youth Leadership Program'],
    required: [true, 'Membership type is required']
  },
  // Youth Leadership Program specific fields
  age: {
    type: Number,
    min: 18,
    max: 35,
    // Required only for Youth Leadership Program
    validate: {
      validator: function(value) {
        // Skip validation if not a Youth Leadership Program application
        if (this.membershipType !== 'Kisan Youth Leadership Program') return true;
        // Require age for Youth Leadership Program
        return value !== undefined && value >= 18 && value <= 35;
      },
      message: 'Age must be between 18 and 35 years for Youth Leadership Program'
    }
  },
  education: {
    type: String,
    // Required only for Youth Leadership Program
    validate: {
      validator: function(value) {
        // Skip validation if not a Youth Leadership Program application
        if (this.membershipType !== 'Kisan Youth Leadership Program') return true;
        // Require education for Youth Leadership Program
        return value !== undefined && value.trim().length > 0;
      },
      message: 'Education is required for Youth Leadership Program'
    }
  },
  experience: {
    type: String,
    default: ''
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  applicationId: {
    type: String,
    unique: true
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  },
  statusUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
});

// Update statusUpdatedAt timestamp when status changes
memberSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusUpdatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
