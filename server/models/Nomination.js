const mongoose = require('mongoose');

const NominationSchema = new mongoose.Schema(
  {
    nomineeName: {
      type: String,
      required: [true, 'Nominee name is required'],
      trim: true
    },
    nomineeAge: {
      type: Number
    },
    nomineeGender: {
      type: String,
      enum: ['Male', 'Female', 'Other', '']
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    occupation: {
      type: String,
      required: [true, 'Occupation is required'],
      trim: true
    },
    contribution: {
      type: String,
      trim: true
    },
    nominatorName: {
      type: String,
      required: [true, 'Nominator name is required'],
      trim: true
    },
    nominatorMobile: {
      type: String,
      required: [true, 'Nominator mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
    },
    nominatorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Shortlisted', 'Awarded', 'Rejected'],
      default: 'New'
    },
    reviewNotes: {
      type: String,
      trim: true
    },
    // Document paths
    aadharCardPath: {
      type: String,
      required: [true, 'Aadhar card document is required']
    },
    photographPath: {
      type: String,
      required: [true, 'Photograph is required']
    },
    additionalDocumentPath: {
      type: String
    },
    additionalDocumentType: {
      type: String,
      enum: ['none', 'news_clipping', 'recommendation_letter', 'video_file', 'video_url']
    },
    additionalDocumentUrl: {
      type: String
    },
    // Category/sector
    sector: {
      type: String,
      enum: ['Agriculture', 'Education', 'Social Work', 'Rural Development', 'Other'],
      default: 'Agriculture'
    },
    year: {
      type: Number,
      default: function() {
        return new Date().getFullYear();
      }
    },
    assignedReviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Generate a unique reference number before saving
NominationSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const year = new Date().getFullYear();
  const Model = this.constructor;
  
  // Get the latest nomination to determine the next sequence number
  const latestNomination = await Model.findOne({
    referenceNumber: { $regex: `RKM-VPGP-${year}-` }
  }).sort({ referenceNumber: -1 });
  
  let sequenceNumber = 1001; // Start with 1001
  
  if (latestNomination) {
    const parts = latestNomination.referenceNumber.split('-');
    const lastSequence = parseInt(parts[parts.length - 1]);
    
    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }
  
  this.referenceNumber = `RKM-VPGP-${year}-${sequenceNumber}`;
  next();
});

// Create indexes
NominationSchema.index({ referenceNumber: 1 }, { unique: true });
NominationSchema.index({ status: 1 });
NominationSchema.index({ district: 1, state: 1 });
NominationSchema.index({ nominatorMobile: 1 });

const Nomination = mongoose.model('Nomination', NominationSchema);

module.exports = Nomination; 