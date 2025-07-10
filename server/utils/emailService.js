const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'notifications@rashtriyakisanmanch.org',
    pass: process.env.EMAIL_PASS || 'your-app-password-here'
  }
});

// Admin email recipients
const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? 
  process.env.ADMIN_EMAILS.split(',') : 
  ['testingforcursor@gmail.com'];

// Send member registration notification
const sendMemberRegistrationEmail = asyncHandler(async (member) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'notifications@rashtriyakisanmanch.org',
      to: ADMIN_EMAILS,
      subject: `New Member Registration: ${member.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #4a7c59; text-align: center;">New Member Registration</h2>
          <p>A new member has registered with the following details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Name:</strong> ${member.name}</p>
            <p><strong>Application ID:</strong> ${member.applicationId || 'Not generated'}</p>
            <p><strong>Phone Number:</strong> ${member.phoneNumber || member.mobile || 'Not provided'}</p>
            <p><strong>Location:</strong> ${member.village || ''}, ${member.district || ''}, ${member.state || ''}</p>
            <p><strong>Member Type:</strong> ${member.membershipType || 'General Member'}</p>
            <p><strong>Registration Date:</strong> ${new Date(member.createdAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.ADMIN_URL || 'https://kisan-andolan.vercel.app/'}" 
              style="background-color: #4a7c59; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            This is an automated notification from Rashtriya Kishan Manch Registration System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Member registration email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending member registration email:', error);
    return false;
  }
});

// Send youth program registration notification
const sendYouthRegistrationEmail = asyncHandler(async (member) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'notifications@rashtriyakisanmanch.org',
      to: ADMIN_EMAILS,
      subject: `New Youth Leadership Program Registration: ${member.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #4a7c59; text-align: center;">New Youth Leadership Program Registration</h2>
          <p>A new youth program application has been submitted with the following details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Name:</strong> ${member.name}</p>
            <p><strong>Application ID:</strong> ${member.applicationId || 'Not generated'}</p>
            <p><strong>Age:</strong> ${member.age || 'Not provided'}</p>
            <p><strong>Education:</strong> ${member.education || 'Not provided'}</p>
            <p><strong>Experience:</strong> ${member.experience || 'Not provided'}</p>
            <p><strong>Phone Number:</strong> ${member.phoneNumber || member.mobile || 'Not provided'}</p>
            <p><strong>Location:</strong> ${member.village || ''}, ${member.district || ''}, ${member.state || ''}</p>
            <p><strong>Registration Date:</strong> ${new Date(member.createdAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.ADMIN_URL || 'https://kisan-andolan.vercel.app/'}" 
              style="background-color: #4a7c59; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            This is an automated notification from Rashtriya Kishan Manch Registration System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Youth registration email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending youth registration email:', error);
    return false;
  }
});

// Send nomination notification
const sendNominationEmail = asyncHandler(async (nomination) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'notifications@rashtriyakisanmanch.org',
      to: ADMIN_EMAILS,
      subject: `New Award Nomination: ${nomination.nomineeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #4a7c59; text-align: center;">New Award Nomination Submitted</h2>
          <p>A new nomination for VP Singh – Kisan Gaurav Puraskar has been submitted with the following details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Reference Number:</strong> ${nomination.referenceNumber || 'Not generated'}</p>
            <p><strong>Nominee Name:</strong> ${nomination.nomineeName}</p>
            <p><strong>Nominee Age:</strong> ${nomination.nomineeAge || 'Not provided'}</p>
            <p><strong>Nominee Gender:</strong> ${nomination.nomineeGender || 'Not provided'}</p>
            <p><strong>District:</strong> ${nomination.district}</p>
            <p><strong>State:</strong> ${nomination.state}</p>
            <p><strong>Occupation:</strong> ${nomination.occupation}</p>
            <p><strong>Sector:</strong> ${nomination.sector || 'Agriculture'}</p>
            <p><strong>Nominator:</strong> ${nomination.nominatorName}</p>
            <p><strong>Contact:</strong> ${nomination.nominatorMobile}</p>
            <p><strong>Submission Date:</strong> ${new Date(nomination.createdAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.ADMIN_URL || 'https://kisan-andolan.vercel.app/'}" 
              style="background-color: #4a7c59; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            This is an automated notification from Rashtriya Kishan Manch Nomination System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Nomination email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending nomination email:', error);
    return false;
  }
});

module.exports = {
  sendMemberRegistrationEmail,
  sendYouthRegistrationEmail,
  sendNominationEmail
}; 