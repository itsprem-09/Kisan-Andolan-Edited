const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const ExcelJS = require('exceljs');
const Member = require('../models/Member');
const Nomination = require('../models/Nomination');

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
      experience,
      status,
      idType,
      idNumber,
      district,
      state,
      occupation,
      landHolding,
      email,
      photoUrl,
      idProofUrl
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

    // Define theme colors
    const colors = {
      primary: '#4a7c59',
      secondary: '#333333',
      accent: '#f2f2f2',
      light: '#666666',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c',
      white: '#ffffff'
    };

    // Add border to whole page
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    // Header section with logo placeholder
    doc.rect(50, 50, 70, 70).lineWidth(1).stroke();
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('Rashtriya Kishan Manch', 140, 55)
       .moveDown(0.2);
    
    // Document title based on membership type
    const isYouthProgram = membershipType === 'Kisan Youth Leadership Program';
    doc.fontSize(16)
       .fillColor(colors.secondary)
       .text(isYouthProgram ? 'Youth Leadership Program Application' : 'Membership Application Receipt', 140)
       .moveDown(0.5);

    // Draw colorful header bar
    doc.rect(50, 130, doc.page.width - 100, 40)
       .fillColor(colors.primary)
       .fill();

    // Application ID with contrasting color
    doc.fontSize(16)
       .fillColor(colors.white)
       .text('Application ID:', 70, 142, { continued: true })
       .font('Helvetica-Bold')
       .text(` ${applicationId}`, { align: 'left' });

    // Date information
    const currentDate = formatDate(applicationDate || new Date());
    doc.fontSize(10)
       .fillColor(colors.white)
       .font('Helvetica')
       .text(`Application Date: ${currentDate}`, 70, 142, { align: 'right' });

    // Application status
    const statusColor = status === 'Approved' ? colors.success : 
                       status === 'Rejected' ? colors.error : 
                       status === 'Under Review' ? colors.light : colors.warning;
                       
    doc.roundedRect(doc.page.width - 200, 180, 150, 30, 5)
       .fillColor(statusColor)
       .fill();

    doc.fillColor(colors.white)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(`Status: ${status || 'Pending Review'}`, doc.page.width - 190, 188);

    // Personal Details Section with modern styling
    doc.rect(50, 220, doc.page.width - 100, 2)
       .fillColor(colors.primary)
       .fill();

    doc.fontSize(16)
       .fillColor(colors.primary)
       .font('Helvetica-Bold')
       .text('Personal Information', 50, 230)
       .moveDown(0.5);

    // Create a 2-column layout for personal details
    const leftColumnX = 50;
    const rightColumnX = 300;
    let detailsY = 260;
    
    // Helper function to add a field with label and value
    const addField = (label, value, x, y) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor(colors.light)
         .text(label, x, y);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor(colors.secondary)
         .text(value || 'Not provided', x, y + 15);
      
      return y + 40; // Return the next Y position
    };

    // Left column fields
    detailsY = addField('Full Name', name, leftColumnX, detailsY);
    detailsY = addField('Mobile Number', phoneNumber ? `+91 ${phoneNumber}` : undefined, leftColumnX, detailsY);
    detailsY = addField('Email', email, leftColumnX, detailsY);
    
    if (isYouthProgram) {
      detailsY = addField('Age', age, leftColumnX, detailsY);
    }

    // Reset Y for right column
    detailsY = 260;
    
    // Right column fields
    detailsY = addField('Location', `${village || district || ''}${(village || district) && (city || state) ? ', ' : ''}${city || state || ''}`, rightColumnX, detailsY);
    detailsY = addField('Occupation', occupation, rightColumnX, detailsY);
    
    if (isYouthProgram) {
      detailsY = addField('Education', education, rightColumnX, detailsY);
      detailsY = addField('Experience', experience, rightColumnX, detailsY);
    } else {
      detailsY = addField('Membership Type', membershipType || 'General Member', rightColumnX, detailsY);
      detailsY = addField('Land Holding', landHolding, rightColumnX, detailsY);
    }

    // ID Verification section if available
    if (idType || idNumber || idProofUrl) {
      const idSectionY = 420;
      
      doc.rect(50, idSectionY - 10, doc.page.width - 100, 2)
         .fillColor(colors.primary)
         .fill();

      doc.fontSize(16)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text('ID Verification', 50, idSectionY)
         .moveDown(0.5);
      
      let idDetailsY = idSectionY + 30;
      
      idDetailsY = addField('ID Type', idType, leftColumnX, idDetailsY);
      idDetailsY = addField('ID Number', idNumber, leftColumnX, idDetailsY);
      
      // Add note about documents
      if (idProofUrl || photoUrl) {
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .fillColor(colors.light)
           .text('* ID documents and photo have been submitted electronically.', 50, idDetailsY + 20);
      }
    }

    // Next steps section
    const nextStepsY = 540;
    
    doc.rect(50, nextStepsY - 10, doc.page.width - 100, 2)
       .fillColor(colors.primary)
       .fill();

    doc.fontSize(16)
       .fillColor(colors.primary)
       .font('Helvetica-Bold')
       .text('Next Steps', 50, nextStepsY)
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .fillColor(colors.secondary);

    if (isYouthProgram) {
      doc.text('1. Our team will review your application within 7 working days.', 70, nextStepsY + 30)
         .moveDown(0.5)
         .text('2. Shortlisted candidates will be contacted for an interview.')
         .moveDown(0.5)
         .text('3. Final selection will be communicated via SMS to your registered phone number.');
    } else {
      doc.text('1. Your membership application will be reviewed within 5 working days.', 70, nextStepsY + 30)
         .moveDown(0.5)
         .text('2. You will receive an SMS confirmation once your application is approved.')
         .moveDown(0.5)
         .text('3. Your membership card will be available for download after approval.');
    }

    // Contact information section
    const contactY = 650;
    
    doc.rect(50, contactY - 10, doc.page.width - 100, 2)
       .fillColor(colors.primary)
       .fill();

    doc.fontSize(16)
       .fillColor(colors.primary)
       .font('Helvetica-Bold')
       .text('Contact Information', 50, contactY)
       .moveDown(0.5);

    // Contact details in a boxed format
    doc.rect(50, contactY + 30, doc.page.width - 100, 80)
       .fillColor(colors.accent)
       .fill()
       .strokeColor(colors.primary)
       .stroke();

    doc.fontSize(11)
       .font('Helvetica')
       .fillColor(colors.secondary)
       .text('For any queries related to your application, please contact:', 70, contactY + 40)
       .moveDown(0.5);
    
    // Two-column contact information
    doc.text('Phone: +917860411111', 70, contactY + 65);
    doc.text('Email: support@rashtriyakishanmanch.org', 300, contactY + 65);
    doc.text('Website: www.rashtriyakishanmanch.org', 70, contactY + 85);
    doc.text('Address: 1, Paper Mill Colony, Valmiki Nagar, Lucknow', 300, contactY + 85);

    // Footer
    const footerY = doc.page.height - 70;
    
    doc.rect(50, footerY, doc.page.width - 100, 1)
       .fillColor(colors.light)
       .fill();
       
    doc.fontSize(9)
       .fillColor(colors.light)
       .text('This is a computer-generated document and does not require a signature.', 50, footerY + 10, { align: 'center', width: doc.page.width - 100 })
       .moveDown(0.5)
       .text('Rashtriya Kishan Manch © ' + new Date().getFullYear(), { align: 'center', width: doc.page.width - 100 });

    // Add QR code placeholder
    doc.rect(doc.page.width - 100, footerY - 50, 50, 50).stroke();
    
    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Error generating PDF receipt' });
  }
});

// @desc    Generate PDF receipt for nomination
// @route   POST /api/pdf/nomination-receipt
// @access  Public
const generateNominationReceipt = asyncHandler(async (req, res) => {
  try {
    const { 
      nomineeName, 
      nomineeAge, 
      nomineeGender,
      district,
      state, 
      occupation,
      contribution,
      nominatorName,
      nominatorMobile,
      nominatorEmail,
      referenceNumber,
      status,
      nominationDate
    } = req.body;
    
    if (!referenceNumber || !nomineeName) {
      res.status(400);
      throw new Error('Reference Number and Nominee Name are required');
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Nomination Receipt - ${referenceNumber}`,
        Author: 'Rashtriya Kishan Manch',
      }
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nomination_${referenceNumber}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Logo and Header
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#4a7c59')
       .text('Rashtriya Kishan Manch', { align: 'center' })
       .moveDown(0.5);

    // Document title
    doc.fontSize(16)
       .fillColor('#333')
       .text('VP Singh – Kisan Gaurav Puraskar', { align: 'center' })
       .moveDown(0.2);
    
    doc.fontSize(14)
       .text('Nomination Receipt', { align: 'center' })
       .moveDown(0.5);

    // Reference Number with highlight
    doc.fontSize(14)
       .fillColor('#333')
       .text('Reference Number:', { continued: true })
       .fillColor('#4a7c59')
       .font('Helvetica-Bold')
       .text(` ${referenceNumber}`, { align: 'center' })
       .moveDown(1);

    // Horizontal line
    doc.strokeColor('#ccc')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke()
       .moveDown(1);

    // Nominee information
    doc.fontSize(14)
       .fillColor('#333')
       .font('Helvetica-Bold')
       .text('Nominee Details', { underline: true })
       .moveDown(0.5);

    doc.font('Helvetica')
       .fontSize(12)
       .text(`Name: ${nomineeName}`)
       .text(`Age: ${nomineeAge || 'Not Provided'}`)
       .text(`Gender: ${nomineeGender || 'Not Provided'}`)
       .text(`District: ${district}`)
       .text(`State: ${state}`)
       .text(`Occupation: ${occupation}`)
       .moveDown(0.5);

    if (contribution) {
      doc.font('Helvetica-Bold')
         .text('Contribution Summary:')
         .font('Helvetica')
         .text(contribution, {
           width: 495,
           align: 'justify'
         })
         .moveDown(1);
    }

    // Horizontal line
    doc.strokeColor('#ccc')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke()
       .moveDown(1);

    // Nominator information
    doc.fontSize(14)
       .fillColor('#333')
       .font('Helvetica-Bold')
       .text('Nominator Details', { underline: true })
       .moveDown(0.5);

    doc.font('Helvetica')
       .fontSize(12)
       .text(`Name: ${nominatorName}`)
       .text(`Mobile: ${nominatorMobile}`)
       .text(`Email: ${nominatorEmail || 'Not Provided'}`)
       .moveDown(1);

    // Status information
    doc.fontSize(14)
       .fillColor('#333')
       .font('Helvetica-Bold')
       .text('Nomination Status', { underline: true })
       .moveDown(0.5);

    doc.font('Helvetica')
       .fontSize(12)
       .text(`Status: ${status || 'New'}`)
       .text(`Nomination Date: ${new Date(nominationDate).toLocaleDateString()}`)
       .moveDown(1);

    // Instructions
    doc.fontSize(12)
       .fillColor('#666')
       .font('Helvetica-Oblique')
       .text('Note: Please keep this reference number for future communications.', { align: 'center' })
       .moveDown(1);
    
    doc.font('Helvetica')
       .text('Our team will review your nomination and may contact you for additional information. The selection committee will evaluate all nominations based on the criteria outlined for the VP Singh – Kisan Gaurav Puraskar award.', {
         align: 'justify'
       })
       .moveDown(1);

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

// @desc    Export all members to Excel
// @route   GET /api/pdf/export-members-excel
// @access  Private/Admin
const exportMembersToExcel = asyncHandler(async (req, res) => {
  try {
    const { status, membershipType, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (membershipType && membershipType !== 'all') {
      filter.membershipType = membershipType;
    } else {
      // If no specific membershipType is requested, exclude Youth Leadership Program members
      filter.membershipType = { $ne: 'Kisan Youth Leadership Program' };
    }
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        console.log('Start date (raw):', startDate);
        console.log('Start date (parsed):', start.toISOString());
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        console.log('End date (raw):', endDate);
        console.log('End date (parsed):', end.toISOString());
        filter.createdAt.$lte = end;
      }
      
      console.log('Date filter:', JSON.stringify(filter.createdAt));
    }
    
    console.log('Final filter:', JSON.stringify(filter));
    
    // Get all members matching the filter
    const members = await Member.find(filter).sort({ createdAt: -1 });
    
    // Log dates to help debug filtering
    if (members.length > 0) {
      console.log('Sample dates from results:');
      members.slice(0, 5).forEach(member => {
        console.log(`ID: ${member._id}, Date: ${new Date(member.createdAt).toISOString()}`);
      });
    }
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found matching criteria' });
    }

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Member Applications');
    
    // Define columns
    worksheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Member Type', key: 'membershipType', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'ID Type', key: 'idType', width: 15 },
      { header: 'ID Number', key: 'idNumber', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Applied On', key: 'createdAt', width: 20 },
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4A7C59' },
    };
    worksheet.getRow(1).font = {
      color: { argb: 'FFFFFF' },
      bold: true,
    };
    
    // Add members data
    members.forEach(member => {
      worksheet.addRow({
        applicationId: member.applicationId || 'N/A',
        name: member.name || 'N/A',
        mobile: member.mobile || member.phoneNumber || 'N/A',
        email: member.email || 'N/A',
        membershipType: member.membershipType || member.memberType || 'General Member',
        occupation: member.occupation || 'N/A',
        district: member.district || 'N/A',
        state: member.state || 'N/A',
        idType: member.idType || 'N/A',
        idNumber: member.idNumber || 'N/A',
        status: member.status || 'Pending',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A',
      });
    });
    
    // Apply alternating row styling
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' },
          };
        }
        
        // Apply cell borders
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });
    
    // Create filter details section to show what filters were applied
    const filterText = [];
    if (status && status !== 'all') filterText.push(`Status: ${status}`);
    if (startDate) filterText.push(`From: ${new Date(startDate).toLocaleDateString()}`);
    if (endDate) filterText.push(`To: ${new Date(endDate).toLocaleDateString()}`);
    
    // Insert metadata at the top of the sheet if filters were applied
    if (filterText.length > 0) {
      worksheet.spliceRows(1, 0, 
        ['Export Date: ' + new Date().toLocaleDateString()],
        ['Filters Applied: ' + filterText.join(' | ')],
        ['Total Records: ' + members.length],
        [''] // Empty row before data
      );
      
      // Style metadata rows
      for (let i = 1; i <= 3; i++) {
        worksheet.getRow(i).font = { italic: true, color: { argb: '666666' } };
      }
    }
    
    // Write to buffer and send response
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=members_export_${Date.now()}.xlsx`);
    res.setHeader('Content-Length', buffer.length);
    
    res.end(buffer);
    
  } catch (error) {
    console.error('Error exporting members to Excel:', error);
    res.status(500).json({ message: 'Error generating Excel export' });
  }
});

// @desc    Export all youth program applications to Excel
// @route   GET /api/pdf/export-youth-excel
// @access  Private/Admin
const exportYouthToExcel = asyncHandler(async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = { membershipType: 'Kisan Youth Leadership Program' };
    if (status && status !== 'all') filter.status = status;
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        filter.createdAt.$lte = end;
      }
    }
    
    console.log('Youth Excel filter:', JSON.stringify(filter));
    
    // Get all youth members matching the filter
    const members = await Member.find(filter).sort({ createdAt: -1 });
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No youth program applications found matching criteria' });
    }
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Youth Program');
    
    // Add headers
    worksheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 15 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Phone Number', key: 'mobile', width: 15 },
      { header: 'Village', key: 'village', width: 15 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Education', key: 'education', width: 20 },
      { header: 'Experience', key: 'experience', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Applied On', key: 'createdAt', width: 15 },
    ];
    
    // Add data rows
    members.forEach(member => {
      worksheet.addRow({
        applicationId: member.applicationId || 'N/A',
        name: member.name || 'N/A',
        mobile: member.mobile || member.phoneNumber || 'N/A',
        village: member.village || 'N/A',
        district: member.district || 'N/A',
        state: member.state || 'N/A',
        age: member.age || 'N/A',
        education: member.education || 'N/A',
        experience: member.experience || 'N/A',
        status: member.status || 'Pending',
        createdAt: formatDate(member.createdAt)
      });
    });
    
    // Style the header
    worksheet.getRow(1).font = { bold: true };
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=youth_program_export_${Date.now()}.xlsx`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Export to Excel Error:', error);
    res.status(500).json({ message: 'Error exporting youth applications to Excel' });
  }
});

// @desc    Export all nominations to Excel
// @route   GET /api/pdf/export-nominations-excel
// @access  Private/Admin
const exportNominationsToExcel = asyncHandler(async (req, res) => {
  try {
    const { status, sector, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (sector && sector !== 'all') filter.sector = sector;
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        filter.createdAt.$lte = end;
      }
    }
    
    console.log('Nominations Excel filter:', JSON.stringify(filter));
    
    // Get all nominations matching the filter
    const nominations = await Nomination.find(filter).sort({ createdAt: -1 });
    
    if (!nominations || nominations.length === 0) {
      return res.status(404).json({ message: 'No nominations found matching criteria' });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nominations');
    
    // Add headers
    worksheet.columns = [
      { header: 'Reference Number', key: 'referenceNumber', width: 18 },
      { header: 'Nominee Name', key: 'nomineeName', width: 20 },
      { header: 'Nominee Age', key: 'nomineeAge', width: 12 },
      { header: 'Gender', key: 'nomineeGender', width: 10 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'Sector', key: 'sector', width: 15 },
      { header: 'Nominator Name', key: 'nominatorName', width: 20 },
      { header: 'Nominator Mobile', key: 'nominatorMobile', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Submitted On', key: 'createdAt', width: 15 },
    ];
    
    // Add data rows
    nominations.forEach(nomination => {
      worksheet.addRow({
        referenceNumber: nomination.referenceNumber || 'N/A',
        nomineeName: nomination.nomineeName || 'N/A',
        nomineeAge: nomination.nomineeAge || 'N/A',
        nomineeGender: nomination.nomineeGender || 'N/A',
        district: nomination.district || 'N/A',
        state: nomination.state || 'N/A',
        occupation: nomination.occupation || 'N/A',
        sector: nomination.sector || 'Agriculture',
        nominatorName: nomination.nominatorName || 'N/A',
        nominatorMobile: nomination.nominatorMobile || 'N/A',
        status: nomination.status || 'New',
        createdAt: formatDate(nomination.createdAt)
      });
    });
    
    // Style the header
    worksheet.getRow(1).font = { bold: true };
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=nominations_export_${Date.now()}.xlsx`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Export to Excel Error:', error);
    res.status(500).json({ message: 'Error exporting nominations to Excel' });
  }
});

// @desc    Export members to PDF
// @route   GET /api/pdf/export-members-pdf
// @access  Private/Admin
const exportMembersToPdf = asyncHandler(async (req, res) => {
  try {
    const { status, membershipType, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (membershipType && membershipType !== 'all') {
      filter.membershipType = membershipType;
    } else {
      // If no specific membershipType is requested, exclude Youth Leadership Program members
      filter.membershipType = { $ne: 'Kisan Youth Leadership Program' };
    }
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        console.log('PDF Start date (raw):', startDate);
        console.log('PDF Start date (parsed):', start.toISOString());
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        console.log('PDF End date (raw):', endDate);
        console.log('PDF End date (parsed):', end.toISOString());
        filter.createdAt.$lte = end;
      }
      
      console.log('PDF Date filter:', JSON.stringify(filter.createdAt));
    }
    
    console.log('PDF Final filter:', JSON.stringify(filter));
    
    // Get all members matching the filter
    const members = await Member.find(filter).sort({ createdAt: -1 });
    
    // Log dates to help debug filtering
    if (members.length > 0) {
      console.log('PDF Sample dates from results:');
      members.slice(0, 5).forEach(member => {
        console.log(`ID: ${member._id}, Date: ${new Date(member.createdAt).toISOString()}`);
      });
    }
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found matching criteria' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
      info: {
        Title: `Member Applications Export`,
        Author: 'Rashtriya Kishan Manch',
      }
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=members_export_${Date.now()}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Helper function to add a header to each page
    const addHeader = () => {
      // Logo placeholder - replace with actual logo if available
      doc.rect(50, 30, 50, 50).stroke();
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#4a7c59')
         .text('Rashtriya Kishan Manch', 120, 40)
         .fontSize(14)
         .fillColor('#666')
         .text('Member Applications Report', 120, 65);
    };

    // Helper function to add a footer to each page
    const addFooter = (pageNumber) => {
      const totalPages = doc.bufferedPageRange().count;
      doc.fontSize(10)
         .fillColor('#666')
         .text(
           `Page ${pageNumber} of ${totalPages}`,
           50,
           doc.page.height - 50,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
           50,
           doc.page.height - 35,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           'Rashtriya Kishan Manch © ' + new Date().getFullYear(),
           50,
           doc.page.height - 20,
           { align: 'center', width: doc.page.width - 100 }
         );
    };

    // Add the first page header
    addHeader();

    // Add report details
    doc.fontSize(12)
       .fillColor('#333')
       .text('Report Details:', 50, 100)
       .fontSize(10)
       .moveDown(0.2)
       .text(`Status Filter: ${status || 'All'}`)
       .moveDown(0.2)
       .text(`Type Filter: ${membershipType || 'All'}`)
       .moveDown(0.2)
       .text(`Total Records: ${members.length}`)
       .moveDown(1.5);

    // Table settings
    const tableTop = 180;
    const tableHeaders = ['App ID', 'Name', 'Contact', 'Location', 'Type', 'Status', 'Date'];
    const columnWidths = [70, 100, 80, 100, 70, 60, 70];
    const rowHeight = 25;
    
    // Draw table header with background
    doc.rect(50, tableTop - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
    doc.fillColor('#333');
    
    doc.fontSize(10).font('Helvetica-Bold');
    let currentX = 50;
    
    tableHeaders.forEach((header, i) => {
      doc.text(header, currentX + 5, tableTop, { width: columnWidths[i], align: 'left' });
      currentX += columnWidths[i];
    });
    
    // Draw vertical grid lines for header
    currentX = 50;
    for (let i = 0; i <= tableHeaders.length; i++) {
      doc.moveTo(currentX, tableTop - 5)
         .lineTo(currentX, tableTop + rowHeight - 5)
         .stroke();
      
      if (i < tableHeaders.length) {
        currentX += columnWidths[i];
      }
    }
    
    // Draw horizontal line below header
    doc.moveTo(50, tableTop + rowHeight - 5)
       .lineTo(600, tableTop + rowHeight - 5)
       .stroke();
    
    // Track current Y position for rows
    let yPosition = tableTop + rowHeight;
    
    // Add table rows
    doc.font('Helvetica').fontSize(9);
    
    members.forEach((member, index) => {
      // Check if we need a new page
      if (yPosition + rowHeight > doc.page.height - 70) {
        doc.addPage();
        addHeader();
        yPosition = 120; // Reset y position for the new page
        
        // Redraw table header on the new page
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
        doc.fillColor('#333');
        
        doc.fontSize(10).font('Helvetica-Bold');
        currentX = 50;
        
        tableHeaders.forEach((header, i) => {
          doc.text(header, currentX + 5, yPosition, { width: columnWidths[i], align: 'left' });
          currentX += columnWidths[i];
        });
        
        // Draw vertical grid lines for header
        currentX = 50;
        for (let i = 0; i <= tableHeaders.length; i++) {
          doc.moveTo(currentX, yPosition - 5)
             .lineTo(currentX, yPosition + rowHeight - 5)
             .stroke();
          
          if (i < tableHeaders.length) {
            currentX += columnWidths[i];
          }
        }
        
        // Draw horizontal line below header
        doc.moveTo(50, yPosition + rowHeight - 5)
           .lineTo(600, yPosition + rowHeight - 5)
           .stroke();
        
        yPosition += rowHeight;
        doc.font('Helvetica').fontSize(9);
      }
      
      // Add zebra striping for alternating rows
      if (index % 2 === 0) {
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f9f9f9').fill();
        doc.fillColor('#333'); // Reset text color
      }
      
      // Format data for display
      const rowData = [
        member.applicationId || 'N/A',
        member.name || 'N/A',
        member.mobile || member.phoneNumber || 'N/A',
        `${member.village || ''}, ${member.district || ''}`,
        member.membershipType || 'General',
        member.status || 'Pending',
        formatDate(member.createdAt)
      ];
      
      // Draw each cell in the row
      currentX = 50;
      rowData.forEach((cell, i) => {
        // Add text with proper padding
        doc.text(
          String(cell).substring(0, 20) + (String(cell).length > 20 ? '...' : ''),
          currentX + 5,
          yPosition,
          { width: columnWidths[i] - 10, align: 'left' }
        );
        currentX += columnWidths[i];
      });
      
      // Draw vertical grid lines for row
      currentX = 50;
      for (let i = 0; i <= tableHeaders.length; i++) {
        doc.moveTo(currentX, yPosition - 5)
           .lineTo(currentX, yPosition + rowHeight - 5)
           .stroke();
        
        if (i < tableHeaders.length) {
          currentX += columnWidths[i];
        }
      }
      
      // Draw horizontal line below row
      doc.moveTo(50, yPosition + rowHeight - 5)
         .lineTo(600, yPosition + rowHeight - 5)
         .stroke();
      
      yPosition += rowHeight;
    });
    
    // Add page numbers to all pages
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      addFooter(i + 1);
    }

    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('Export to PDF Error:', error);
    res.status(500).json({ message: 'Error exporting members to PDF' });
  }
});

// @desc    Generate PDF for bulk youth program export
// @route   GET /api/pdf/export-youth-pdf
// @access  Private/Admin
const exportYouthToPdf = asyncHandler(async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = { membershipType: 'Kisan Youth Leadership Program' };
    if (status && status !== 'all') filter.status = status;
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        filter.createdAt.$lte = end;
      }
    }
    
    console.log('Youth PDF filter:', JSON.stringify(filter));
    
    // Get all youth members matching the filter
    const members = await Member.find(filter).sort({ createdAt: -1 });
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No youth program applications found matching criteria' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
      info: {
        Title: `Youth Program Applications Export`,
        Author: 'Rashtriya Kishan Manch',
      }
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=youth_program_export_${Date.now()}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Helper function to add a header to each page
    const addHeader = () => {
      // Logo placeholder - replace with actual logo if available
      doc.rect(50, 30, 50, 50).stroke();
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#4a7c59')
         .text('Rashtriya Kishan Manch', 120, 40)
         .fontSize(14)
         .fillColor('#666')
         .text('Youth Leadership Program Applications', 120, 65);
    };

    // Helper function to add a footer to each page
    const addFooter = (pageNumber) => {
      const totalPages = doc.bufferedPageRange().count;
      doc.fontSize(10)
         .fillColor('#666')
         .text(
           `Page ${pageNumber} of ${totalPages}`,
           50,
           doc.page.height - 50,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
           50,
           doc.page.height - 35,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           'Rashtriya Kishan Manch © ' + new Date().getFullYear(),
           50,
           doc.page.height - 20,
           { align: 'center', width: doc.page.width - 100 }
         );
    };

    // Add the first page header
    addHeader();

    // Add report details
    doc.fontSize(12)
       .fillColor('#333')
       .text('Report Details:', 50, 100)
       .fontSize(10)
       .moveDown(0.2)
       .text(`Status Filter: ${status || 'All'}`)
       .moveDown(0.2)
       .text(`Total Records: ${members.length}`)
       .moveDown(1.5);

    // Table settings
    const tableTop = 180;
    const tableHeaders = ['App ID', 'Name', 'Age', 'Education', 'Location', 'Status', 'Date'];
    const columnWidths = [70, 100, 40, 100, 80, 60, 70];
    const rowHeight = 25;
    
    // Draw table header with background
    doc.rect(50, tableTop - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
    doc.fillColor('#333');
    
    doc.fontSize(10).font('Helvetica-Bold');
    let currentX = 50;
    
    tableHeaders.forEach((header, i) => {
      doc.text(header, currentX + 5, tableTop, { width: columnWidths[i], align: 'left' });
      currentX += columnWidths[i];
    });
    
    // Draw vertical grid lines for header
    currentX = 50;
    for (let i = 0; i <= tableHeaders.length; i++) {
      doc.moveTo(currentX, tableTop - 5)
         .lineTo(currentX, tableTop + rowHeight - 5)
         .stroke();
      
      if (i < tableHeaders.length) {
        currentX += columnWidths[i];
      }
    }
    
    // Draw horizontal line below header
    doc.moveTo(50, tableTop + rowHeight - 5)
       .lineTo(600, tableTop + rowHeight - 5)
       .stroke();
    
    // Track current Y position for rows
    let yPosition = tableTop + rowHeight;
    
    // Add table rows
    doc.font('Helvetica').fontSize(9);
    
    members.forEach((member, index) => {
      // Check if we need a new page
      if (yPosition + rowHeight > doc.page.height - 70) {
        doc.addPage();
        addHeader();
        yPosition = 120; // Reset y position for the new page
        
        // Redraw table header on the new page
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
        doc.fillColor('#333');
        
        doc.fontSize(10).font('Helvetica-Bold');
        currentX = 50;
        
        tableHeaders.forEach((header, i) => {
          doc.text(header, currentX + 5, yPosition, { width: columnWidths[i], align: 'left' });
          currentX += columnWidths[i];
        });
        
        // Draw vertical grid lines for header
        currentX = 50;
        for (let i = 0; i <= tableHeaders.length; i++) {
          doc.moveTo(currentX, yPosition - 5)
             .lineTo(currentX, yPosition + rowHeight - 5)
             .stroke();
          
          if (i < tableHeaders.length) {
            currentX += columnWidths[i];
          }
        }
        
        // Draw horizontal line below header
        doc.moveTo(50, yPosition + rowHeight - 5)
           .lineTo(600, yPosition + rowHeight - 5)
           .stroke();
        
        yPosition += rowHeight;
        doc.font('Helvetica').fontSize(9);
      }
      
      // Add zebra striping for alternating rows
      if (index % 2 === 0) {
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f9f9f9').fill();
        doc.fillColor('#333'); // Reset text color
      }
      
      // Format data for display
      const rowData = [
        member.applicationId || 'N/A',
        member.name || 'N/A',
        member.age || 'N/A',
        member.education || 'N/A',
        `${member.village || ''}, ${member.district || ''}`,
        member.status || 'Pending',
        formatDate(member.createdAt)
      ];
      
      // Draw each cell in the row
      currentX = 50;
      rowData.forEach((cell, i) => {
        // Add text with proper padding
        doc.text(
          String(cell).substring(0, 20) + (String(cell).length > 20 ? '...' : ''),
          currentX + 5,
          yPosition,
          { width: columnWidths[i] - 10, align: 'left' }
        );
        currentX += columnWidths[i];
      });
      
      // Draw vertical grid lines for row
      currentX = 50;
      for (let i = 0; i <= tableHeaders.length; i++) {
        doc.moveTo(currentX, yPosition - 5)
           .lineTo(currentX, yPosition + rowHeight - 5)
           .stroke();
        
        if (i < tableHeaders.length) {
          currentX += columnWidths[i];
        }
      }
      
      // Draw horizontal line below row
      doc.moveTo(50, yPosition + rowHeight - 5)
         .lineTo(600, yPosition + rowHeight - 5)
         .stroke();
      
      yPosition += rowHeight;
    });
    
    // Add page numbers to all pages
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      addFooter(i + 1);
    }

    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('Export to PDF Error:', error);
    res.status(500).json({ message: 'Error exporting youth applications to PDF' });
  }
});

// @desc    Generate PDF for bulk nominations export
// @route   GET /api/pdf/export-nominations-pdf
// @access  Private/Admin
const exportNominationsToPdf = asyncHandler(async (req, res) => {
  try {
    const { status, sector, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (sector && sector !== 'all') filter.sector = sector;
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        // Parse the date in ISO format and set to start of day (00:00:00.000)
        const start = new Date(startDate + 'T00:00:00.000Z');
        filter.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Parse the date in ISO format and set to end of day (23:59:59.999)
        const end = new Date(endDate + 'T23:59:59.999Z');
        filter.createdAt.$lte = end;
      }
    }
    
    console.log('Nominations PDF filter:', JSON.stringify(filter));
    
    // Get all nominations matching the filter
    const nominations = await Nomination.find(filter).sort({ createdAt: -1 });
    
    if (!nominations || nominations.length === 0) {
      return res.status(404).json({ message: 'No nominations found matching criteria' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
      info: {
        Title: `Award Nominations Export`,
        Author: 'Rashtriya Kishan Manch',
      }
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nominations_export_${Date.now()}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Helper function to add a header to each page
    const addHeader = () => {
      // Logo placeholder - replace with actual logo if available
      doc.rect(50, 30, 50, 50).stroke();
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#4a7c59')
         .text('Rashtriya Kishan Manch', 120, 40)
         .fontSize(14)
         .fillColor('#666')
         .text('VP Singh – Kisan Gaurav Puraskar Nominations', 120, 65);
    };

    // Helper function to add a footer to each page
    const addFooter = (pageNumber) => {
      const totalPages = doc.bufferedPageRange().count;
      doc.fontSize(10)
         .fillColor('#666')
         .text(
           `Page ${pageNumber} of ${totalPages}`,
           50,
           doc.page.height - 50,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
           50,
           doc.page.height - 35,
           { align: 'center', width: doc.page.width - 100 }
         )
         .text(
           'Rashtriya Kishan Manch © ' + new Date().getFullYear(),
           50,
           doc.page.height - 20,
           { align: 'center', width: doc.page.width - 100 }
         );
    };

    // Add the first page header
    addHeader();

    // Add report details
    doc.fontSize(12)
       .fillColor('#333')
       .text('Report Details:', 50, 100)
       .fontSize(10)
       .moveDown(0.2)
       .text(`Status Filter: ${status || 'All'}`)
       .moveDown(0.2)
       .text(`Sector Filter: ${sector || 'All'}`)
       .moveDown(0.2)
       .text(`Total Records: ${nominations.length}`)
       .moveDown(1.5);

    // Table settings
    const tableTop = 180;
    const tableHeaders = ['Ref No', 'Nominee Name', 'Location', 'Sector', 'Nominator', 'Status', 'Date'];
    const columnWidths = [70, 90, 90, 70, 90, 60, 70];
    const rowHeight = 25;
    
    // Draw table header with background
    doc.rect(50, tableTop - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
    doc.fillColor('#333');
    
    doc.fontSize(10).font('Helvetica-Bold');
    let currentX = 50;
    
    tableHeaders.forEach((header, i) => {
      doc.text(header, currentX + 5, tableTop, { width: columnWidths[i], align: 'left' });
      currentX += columnWidths[i];
    });
    
    // Draw vertical grid lines for header
    currentX = 50;
    for (let i = 0; i <= tableHeaders.length; i++) {
      doc.moveTo(currentX, tableTop - 5)
         .lineTo(currentX, tableTop + rowHeight - 5)
         .stroke();
      
      if (i < tableHeaders.length) {
        currentX += columnWidths[i];
      }
    }
    
    // Draw horizontal line below header
    doc.moveTo(50, tableTop + rowHeight - 5)
       .lineTo(600, tableTop + rowHeight - 5)
       .stroke();
    
    // Track current Y position for rows
    let yPosition = tableTop + rowHeight;
    
    // Add table rows
    doc.font('Helvetica').fontSize(9);
    
    nominations.forEach((nomination, index) => {
      // Check if we need a new page
      if (yPosition + rowHeight > doc.page.height - 70) {
        doc.addPage();
        addHeader();
        yPosition = 120; // Reset y position for the new page
        
        // Redraw table header on the new page
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f2f2f2').fill();
        doc.fillColor('#333');
        
        doc.fontSize(10).font('Helvetica-Bold');
        currentX = 50;
        
        tableHeaders.forEach((header, i) => {
          doc.text(header, currentX + 5, yPosition, { width: columnWidths[i], align: 'left' });
          currentX += columnWidths[i];
        });
        
        // Draw vertical grid lines for header
        currentX = 50;
        for (let i = 0; i <= tableHeaders.length; i++) {
          doc.moveTo(currentX, yPosition - 5)
             .lineTo(currentX, yPosition + rowHeight - 5)
             .stroke();
          
          if (i < tableHeaders.length) {
            currentX += columnWidths[i];
          }
        }
        
        // Draw horizontal line below header
        doc.moveTo(50, yPosition + rowHeight - 5)
           .lineTo(600, yPosition + rowHeight - 5)
           .stroke();
        
        yPosition += rowHeight;
        doc.font('Helvetica').fontSize(9);
      }
      
      // Add zebra striping for alternating rows
      if (index % 2 === 0) {
        doc.rect(50, yPosition - 5, 550, rowHeight).fillColor('#f9f9f9').fill();
        doc.fillColor('#333'); // Reset text color
      }
      
      // Format data for display
      const rowData = [
        nomination.referenceNumber || 'N/A',
        nomination.nomineeName || 'N/A',
        `${nomination.district || ''}, ${nomination.state || ''}`,
        nomination.sector || 'Agriculture',
        nomination.nominatorName || 'N/A',
        nomination.status || 'New',
        formatDate(nomination.createdAt)
      ];
      
      // Draw each cell in the row
      currentX = 50;
      rowData.forEach((cell, i) => {
        // Add text with proper padding
        doc.text(
          String(cell).substring(0, 20) + (String(cell).length > 20 ? '...' : ''),
          currentX + 5,
          yPosition,
          { width: columnWidths[i] - 10, align: 'left' }
        );
        currentX += columnWidths[i];
      });
      
      // Draw vertical grid lines for row
      currentX = 50;
      for (let i = 0; i <= tableHeaders.length; i++) {
        doc.moveTo(currentX, yPosition - 5)
           .lineTo(currentX, yPosition + rowHeight - 5)
           .stroke();
        
        if (i < tableHeaders.length) {
          currentX += columnWidths[i];
        }
      }
      
      // Draw horizontal line below row
      doc.moveTo(50, yPosition + rowHeight - 5)
         .lineTo(600, yPosition + rowHeight - 5)
         .stroke();
      
      yPosition += rowHeight;
    });
    
    // Add page numbers to all pages
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      addFooter(i + 1);
    }

    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('Export to PDF Error:', error);
    res.status(500).json({ message: 'Error exporting nominations to PDF' });
  }
});

// @desc    Export selected members to Excel
// @route   POST /api/pdf/export-selected-members-excel
// @access  Private/Admin
const exportSelectedMembersToExcel = asyncHandler(async (req, res) => {
  try {
    const { memberIds } = req.body;
    
    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: 'No member IDs provided' });
    }
    
    // Get all members matching the provided IDs
    const members = await Member.find({ _id: { $in: memberIds } }).sort({ createdAt: -1 });
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found matching the provided IDs' });
    }

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Selected Members');
    
    // Define columns
    worksheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Member Type', key: 'membershipType', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'ID Type', key: 'idType', width: 15 },
      { header: 'ID Number', key: 'idNumber', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Applied On', key: 'createdAt', width: 20 },
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4A7C59' },
    };
    worksheet.getRow(1).font = {
      color: { argb: 'FFFFFF' },
      bold: true,
    };
    
    // Add members data
    members.forEach(member => {
      worksheet.addRow({
        applicationId: member.applicationId || 'N/A',
        name: member.name || 'N/A',
        mobile: member.mobile || member.phoneNumber || 'N/A',
        email: member.email || 'N/A',
        membershipType: member.membershipType || member.memberType || 'General Member',
        occupation: member.occupation || 'N/A',
        district: member.district || 'N/A',
        state: member.state || 'N/A',
        idType: member.idType || 'N/A',
        idNumber: member.idNumber || 'N/A',
        status: member.status || 'Pending',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A',
      });
    });
    
    // Apply alternating row styling
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' },
          };
        }
        
        // Apply cell borders
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });
    
    // Write to buffer and send response
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=selected_members_export_${Date.now()}.xlsx`);
    res.setHeader('Content-Length', buffer.length);
    
    res.end(buffer);
    
  } catch (error) {
    console.error('Error exporting selected members to Excel:', error);
    res.status(500).json({ message: 'Error generating Excel export' });
  }
});

// @desc    Export selected members to PDF
// @route   POST /api/pdf/export-selected-members-pdf
// @access  Private/Admin
const exportSelectedMembersToPdf = asyncHandler(async (req, res) => {
  try {
    const { memberIds } = req.body;
    
    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: 'No member IDs provided' });
    }
    
    // Get all members matching the provided IDs
    const members = await Member.find({ _id: { $in: memberIds } }).sort({ createdAt: -1 });
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found matching the provided IDs' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Selected Members Export',
        Author: 'Rashtriya Kishan Manch',
        CreationDate: new Date(),
      }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=selected_members_export_${Date.now()}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);
    
    // Define colors
    const colors = {
      primary: '#4a7c59',
      secondary: '#333333',
      light: '#666666',
      accent: '#f2f2f2',
      white: '#ffffff'
    };
    
    // Helper function to add header to each page
    const addHeader = () => {
      doc.font('Helvetica-Bold')
         .fontSize(18)
         .fillColor(colors.primary)
         .text('Selected Members Export', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(10)
         .fillColor(colors.light)
         .text(`Export Date: ${new Date().toLocaleDateString()}`, { align: 'center' })
         .moveDown(1);
    };
    
    // Helper function to add footer to each page
    const addFooter = (pageNumber) => {
      const totalPages = Math.ceil(members.length / 10) + (members.length > 0 ? 1 : 0);
      doc.fontSize(8)
         .fillColor(colors.light)
         .text(
           `Page ${pageNumber} of ${totalPages} | Rashtriya Kishan Manch | Confidential`,
           50,
           doc.page.height - 50,
           { align: 'center', width: doc.page.width - 100 }
         );
    };

    // Add header to the first page
    addHeader();
    
    // Add info about number of members
    doc.font('Helvetica')
       .fontSize(11)
       .fillColor(colors.secondary)
       .text(`Total selected members: ${members.length}`, { align: 'left' })
       .moveDown(1);
    
    // Create table header
    const tableTop = 150;
    const itemsPerPage = 10;
    let currentPage = 1;
    let yPosition = tableTop;
    
    // Table column widths
    const colWidths = {
      applicationId: 80,
      name: 120,
      contact: 100,
      location: 120,
      status: 80,
    };
    
    // Table header function
    const drawTableHeader = () => {
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor(colors.white);
         
      // Draw header background
      doc.rect(50, yPosition, doc.page.width - 100, 20)
         .fillColor(colors.primary)
         .fill();
      
      // Draw header text
      doc.fillColor(colors.white)
         .text('App ID', 55, yPosition + 5, { width: colWidths.applicationId })
         .text('Name', 55 + colWidths.applicationId, yPosition + 5, { width: colWidths.name })
         .text('Contact', 55 + colWidths.applicationId + colWidths.name, yPosition + 5, { width: colWidths.contact })
         .text('Location', 55 + colWidths.applicationId + colWidths.name + colWidths.contact, yPosition + 5, { width: colWidths.location })
         .text('Status', 55 + colWidths.applicationId + colWidths.name + colWidths.contact + colWidths.location, yPosition + 5, { width: colWidths.status });
      
      yPosition += 20;
    };
    
    drawTableHeader();
    
    // Draw table rows
    members.forEach((member, index) => {
      // Check if we need a new page
      if (index > 0 && index % itemsPerPage === 0) {
        addFooter(currentPage);
        doc.addPage();
        currentPage++;
        yPosition = tableTop;
        addHeader();
        drawTableHeader();
      }
      
      // Set zebra striping
      if (index % 2 === 0) {
        doc.rect(50, yPosition, doc.page.width - 100, 40)
           .fillColor('#f2f2f2')
           .fill();
      }
      
      // Draw grid lines
      doc.rect(50, yPosition, doc.page.width - 100, 40)
         .lineWidth(0.5)
         .stroke();
      
      // Draw vertical grid lines
      let xPos = 50;
      [colWidths.applicationId, colWidths.name, colWidths.contact, colWidths.location].forEach(width => {
        xPos += width;
        doc.moveTo(xPos, yPosition)
           .lineTo(xPos, yPosition + 40)
           .lineWidth(0.5)
           .stroke();
      });
      
      // Reset fill color for text
      doc.fillColor(colors.secondary)
         .fontSize(9)
         .font('Helvetica');
         
      // App ID
      doc.text(
        member.applicationId || 'N/A', 
        55, 
        yPosition + 5, 
        { width: colWidths.applicationId - 10 }
      );
      
      // Name and Type
      doc.font('Helvetica-Bold')
         .text(
           member.name || 'Unknown', 
           55 + colWidths.applicationId, 
           yPosition + 5, 
           { width: colWidths.name - 10 }
         )
         .font('Helvetica')
         .fontSize(8)
         .text(
           member.membershipType || member.memberType || 'General Member',
           55 + colWidths.applicationId,
           null,
           { width: colWidths.name - 10 }
         );
      
      // Contact
      doc.fontSize(9)
         .text(
           member.mobile || member.phoneNumber || 'N/A', 
           55 + colWidths.applicationId + colWidths.name, 
           yPosition + 5, 
           { width: colWidths.contact - 10 }
         )
         .fontSize(8)
         .text(
           member.email || 'No email',
           55 + colWidths.applicationId + colWidths.name,
           null,
           { width: colWidths.contact - 10 }
         );
      
      // Location
      doc.fontSize(9)
         .text(
           `${member.district || member.village || 'N/A'}`, 
           55 + colWidths.applicationId + colWidths.name + colWidths.contact, 
           yPosition + 5, 
           { width: colWidths.location - 10 }
         )
         .fontSize(8)
         .text(
           member.state || 'N/A',
           55 + colWidths.applicationId + colWidths.name + colWidths.contact,
           null,
           { width: colWidths.location - 10 }
         );
      
      // Status with colored indicator
      const statusX = 55 + colWidths.applicationId + colWidths.name + colWidths.contact + colWidths.location;
      const status = member.status || 'Pending';
      
      // Draw status indicator
      let statusColor;
      switch (status) {
        case 'Approved':
          statusColor = '#2ecc71'; // Green
          break;
        case 'Rejected':
          statusColor = '#e74c3c'; // Red
          break;
        case 'Under Review':
          statusColor = '#3498db'; // Blue
          break;
        default:
          statusColor = '#f39c12'; // Yellow for pending
      }
      
      doc.roundedRect(statusX, yPosition + 5, 10, 10, 3)
         .fillColor(statusColor)
         .fill();
      
      doc.fillColor(colors.secondary)
         .text(
           status, 
           statusX + 15, 
           yPosition + 5, 
           { width: colWidths.status - 25 }
         );
      
      // Application date in smaller text
      doc.fontSize(8)
         .fillColor(colors.light)
         .text(
           member.createdAt ? `Applied: ${new Date(member.createdAt).toLocaleDateString()}` : 'Date: N/A',
           statusX + 15,
           null,
           { width: colWidths.status - 25 }
         );
      
      yPosition += 40;
    });
    
    // Add footer to the last page
    addFooter(currentPage);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error exporting selected members to PDF:', error);
    res.status(500).json({ message: 'Error generating PDF export' });
  }
});

module.exports = {
  generateApplicationReceipt,
  generateNominationReceipt,
  exportMembersToExcel,
  exportYouthToExcel,
  exportNominationsToExcel,
  exportMembersToPdf,
  exportYouthToPdf,
  exportNominationsToPdf,
  exportSelectedMembersToExcel,
  exportSelectedMembersToPdf
}; 