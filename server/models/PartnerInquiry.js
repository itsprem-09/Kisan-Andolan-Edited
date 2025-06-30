const mongoose = require('mongoose');

const PartnerInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  organization: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['New', 'In Review', 'Contacted', 'Completed', 'Rejected'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const PartnerInquiry = mongoose.model('PartnerInquiry', PartnerInquirySchema);

module.exports = PartnerInquiry; 