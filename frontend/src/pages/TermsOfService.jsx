import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface pb-12 pt-24">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Terms of Service</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <p className="text-sm text-text-secondary">Effective Date: {currentDate}</p>
            <p className="text-sm text-text-secondary">Last Updated: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the website 
              <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline"> https://rashtriyakisanmanch.com</a> ("Website"), 
              operated by Rashtriya Kisan Manch ("we," "us," "our").
            </p>
            <p>
              By accessing or using this Website, you agree to comply with and be legally bound by these Terms, 
              our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and all applicable laws. 
              If you do not agree with these Terms, please refrain from using the Website.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. Use of the Website</h2>
            
            <h3 className="text-xl font-heading font-medium mt-6 mb-3">a. Eligibility</h3>
            <p>
              You must be at least 13 years of age to use this Website. By using the site, you represent that you meet this age requirement.
            </p>
            
            <h3 className="text-xl font-heading font-medium mt-6 mb-3">b. Permitted Use</h3>
            <p>You may use the Website solely for lawful purposes, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Learning about campaigns, events, and initiatives</li>
              <li>Participating in petitions or surveys</li>
              <li>Volunteering or enrolling in training programs</li>
              <li>Making donations or requesting aid (where applicable)</li>
              <li>Submitting contact forms or feedback</li>
            </ul>
            <p>You may not use the Website for any unlawful, abusive, or disruptive purposes.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. User Submissions</h2>
            <p>When you submit data (such as forms, petitions, feedback, or volunteer requests), you:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Warrant that the information is truthful and not misleading</li>
              <li>Agree that your submissions may be stored, reviewed, and used by Rashtriya Kisan Manch for campaign or engagement purposes</li>
              <li>Consent to being contacted via email, phone, or messaging services</li>
            </ul>
            <p>
              We reserve the right to reject or delete any user-generated content that we consider inappropriate, offensive, misleading, or harmful.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Donations and Financial Transactions</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Donations made via the Website are voluntary and non-refundable unless explicitly stated.</li>
              <li>We use secure, third-party payment processors; Rashtriya Kisan Manch does not store card or UPI details.</li>
              <li>You agree not to use any fraudulent means for making financial contributions.</li>
              <li>Acknowledgment receipts may be provided for verified contributions in accordance with applicable laws.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. Intellectual Property Rights</h2>
            <p>
              All content on the Website, including but not limited to text, graphics, logos, images, videos, icons, and design elements, 
              is the property of Rashtriya Kisan Manch or its licensors and is protected under applicable intellectual property laws.
            </p>
            <p>
              You may not reproduce, modify, distribute, or publicly display any part of the Website without express written permission.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. Third-Party Links</h2>
            <p>
              The Website may contain links to third-party websites or services. We are not responsible for the content, 
              accuracy, or practices of such third-party platforms. Your use of those platforms is subject to their respective terms and policies.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Privacy</h2>
            <p>
              Your use of the Website is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
              which describes how we collect, use, and safeguard your personal information. Please review it carefully.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>To the fullest extent permitted under applicable law, Rashtriya Kisan Manch shall not be liable for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of data, revenue, goodwill, or reputation</li>
              <li>Delays, disruptions, or data loss due to server or internet issues</li>
              <li>Unauthorized access to user data beyond our reasonable control</li>
            </ul>
            <p>You agree that your use of the Website is at your sole risk.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Rashtriya Kisan Manch, its leadership, and affiliates from any claims, 
              liabilities, damages, costs, or expenses (including legal fees) arising out of:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Your violation of these Terms</li>
              <li>Your misuse of the Website</li>
              <li>Any false or misleading data submitted by you</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">9. Termination</h2>
            <p>
              We may, at our discretion, suspend or terminate your access to the Website without prior notice if we believe you have 
              violated these Terms or applicable laws.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">10. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising in relation to these Terms shall be subject to the 
              exclusive jurisdiction of the courts located in Lucknow, Uttar Pradesh.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">11. Modifications to Terms</h2>
            <p>
              We may revise these Terms at any time. All updates will be posted on this page with the updated effective date. 
              Continued use of the Website after changes constitutes acceptance of those changes.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">12. Contact</h2>
            <p>For any questions, concerns, or feedback regarding these Terms, please contact:</p>
            <div className="mt-4">
              <p className="font-semibold">Rashtriya Kisan Manch</p>
              <p>Email: rashtriyakisanmanch@gmail.com</p>
              <p>Address: 1, Paper Mill Colony, Valmiki Nagar, Lucknow, Uttar Pradesh, 226006</p>
              <p>Phone: +91-7860411111</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 