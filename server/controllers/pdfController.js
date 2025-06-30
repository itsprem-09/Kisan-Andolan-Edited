const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

// Utility function to format date in DD/MM/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// @desc    Generate PDF receipt for application
// @route   POST /api/pdf/application-receipt
// @access  Public
const generateApplicationReceipt = asyncHandler(async (req, res) => {
  try {
    const { 
      name, 
      village, 
      city,
      phoneNumber, 
      applicationId, 
      membershipType, 
      applicationDate,
      age, 
      education, 
      experience
    } = req.body;
    
    if (!applicationId || !name) {
      res.status(400);
      throw new Error('Application ID and Name are required');
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Application Receipt - ${applicationId}`,
        Author: 'Rashtriya Kishan Manch',
      }
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=application_receipt_${applicationId}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Logo and Header
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#4a7c59')
       .text('Rashtriya Kishan Manch', { align: 'center' })
       .moveDown(0.5);

    // Document title based on membership type
    const isYouthProgram = membershipType === 'Kisan Youth Leadership Program';
    doc.fontSize(16)
       .fillColor('#333')
       .text(isYouthProgram ? 'Youth Leadership Program Application' : 'Membership Application Receipt', { align: 'center' })
       .moveDown(0.5);

    // Application ID with proper prefix highlight
    doc.fontSize(14)
       .fillColor('#333')
       .text('Application ID:', { continued: true })
       .fillColor('#4a7c59')
       .font('Helvetica-Bold')
       .text(` ${applicationId}`, { align: 'center' })
       .moveDown(1);

    // Horizontal line
    doc.strokeColor('#ccc')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke()
       .moveDown(1);

    // Date information
    const currentDate = formatDate(applicationDate || new Date());
    doc.fontSize(10)
       .fillColor('#666')
       .font('Helvetica')
       .text(`Application Date: ${currentDate}`, { align: 'right' })
       .moveDown(1);

    // Personal Details Section
    doc.fontSize(14)
       .fillColor('#4a7c59')
       .font('Helvetica-Bold')
       .text('Personal Details', { underline: true })
       .moveDown(0.5);

    // Personal details in a well-formatted way
    const personalDetails = [
      { label: 'Name', value: name },
      { label: 'Village', value: village },
      { label: 'City/District', value: city || 'Not Provided' },
      { label: 'Phone Number', value: phoneNumber ? `+91 ${phoneNumber}` : 'Not Provided' },
    ];

    // Add youth program specific details if applicable
    if (isYouthProgram) {
      if (age) personalDetails.push({ label: 'Age', value: age });
      if (education) personalDetails.push({ label: 'Education', value: education });
      if (experience) personalDetails.push({ label: 'Experience', value: experience });
    }

    // Draw personal details
    personalDetails.forEach(detail => {
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .fillColor('#333')
         .text(`${detail.label}: `, { continued: true })
         .font('Helvetica')
         .fillColor('#444')
         .text(detail.value)
         .moveDown(0.5);
    });

    doc.moveDown(1);

    // Status information
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .fillColor('#333')
       .text('Application Status: ', { continued: true })
       .font('Helvetica')
       .fillColor('#ff9900')
       .text('Pending Review')
       .moveDown(2);

    // Horizontal line
    doc.strokeColor('#ccc')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke()
       .moveDown(1);

    // Next steps
    doc.fontSize(14)
       .fillColor('#4a7c59')
       .font('Helvetica-Bold')
       .text('Next Steps', { underline: true })
       .moveDown(0.5);

    if (isYouthProgram) {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#444')
         .text('1. Our team will review your application within 7 working days.')
         .moveDown(0.2)
         .text('2. Shortlisted candidates will be contacted for an interview.')
         .moveDown(0.2)
         .text('3. Final selection will be communicated via SMS to your registered phone number.')
         .moveDown(0.2);
    } else {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#444')
         .text('1. Your membership application will be reviewed within 5 working days.')
         .moveDown(0.2)
         .text('2. You will receive an SMS confirmation once your application is approved.')
         .moveDown(0.2)
         .text('3. Your membership card will be available for download after approval.')
         .moveDown(0.2);
    }

    doc.moveDown(1);

    // Contact information
    doc.fontSize(14)
       .fillColor('#4a7c59')
       .font('Helvetica-Bold')
       .text('Contact Information', { underline: true })
       .moveDown(0.5);

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#444')
       .text('For any queries related to your application, please contact:')
       .moveDown(0.2)
       .text('Phone: +917860411111')
       .moveDown(0.2)
       .text('Email: support@rashtriyakishanmanch.org')
       .moveDown(0.2)
       .text('Website: www.rashtriyakishanmanch.org')
       .moveDown(2)
       .text('Address: 1, Paper Mill Colony, Valmiki Nagar, Lucknow, Uttar Pradesh, 226006');

    // Footer
    doc.fontSize(10)
       .fillColor('#666')
       .text('This is a computer-generated document and does not require a signature.', { align: 'center' })
       .moveDown(0.5)
       .text('Rashtriya Kishan Manch © ' + new Date().getFullYear(), { align: 'center' });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Error generating PDF receipt' });
  }
});

module.exports = {
  generateApplicationReceipt
}; 