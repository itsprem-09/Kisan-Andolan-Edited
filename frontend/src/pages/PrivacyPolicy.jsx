import React from 'react';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface pb-12 pt-24">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Privacy Policy</h1>
          <p className="text-sm text-text-secondary mb-6">Effective Date: {currentDate}</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Rashtriya Kisan Manch ("we", "us", or "our") is committed to safeguarding your privacy and ensuring the security of your personal data. 
              This Privacy Policy outlines how we collect, use, share, and protect your information when you interact with our official website: 
              <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline"> https://rashtriyakisanmanch.com</a>
            </p>
            <p>By accessing or using the website, you agree to the terms of this Privacy Policy.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-heading font-medium mt-6 mb-3">a. Personal Information</h3>
            <p>We may collect personally identifiable information, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Postal address and state/district</li>
              <li>Occupation (optional)</li>
              <li>Government-issued identification details (e.g., Aadhaar, Voter ID), only when voluntarily submitted</li>
              <li>Bank account or UPI ID details, when necessary for donation or aid purposes</li>
            </ul>

            <h3 className="text-xl font-heading font-medium mt-6 mb-3">b. Non-Personal Information</h3>
            <p>We automatically collect certain technical information such as:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system and language preference</li>
              <li>Date/time of access and pages visited</li>
            </ul>

            <h3 className="text-xl font-heading font-medium mt-6 mb-3">c. User-Submitted Content</h3>
            <p>This includes information submitted through:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Contact forms</li>
              <li>Petition signatures</li>
              <li>Event and volunteer registrations</li>
              <li>Surveys and campaign responses</li>
            </ul>

            <h3 className="text-xl font-heading font-medium mt-6 mb-3">d. Cookies and Analytics</h3>
            <p>
              We use cookies and analytics tools to enhance user experience, store language preferences, and analyze site 
              traffic patterns. You may adjust your browser settings to disable cookies, though this may affect certain functionalities.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. Use of Information</h2>
            <p>We use the collected data to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Respond to user queries and provide support</li>
              <li>Manage membership, volunteer, or training registration</li>
              <li>Distribute campaign, event, or program updates</li>
              <li>Facilitate petition signing, surveys, and community engagement</li>
              <li>Process donations and provide receipts or acknowledgments</li>
              <li>Customize user experience based on language or region</li>
              <li>Improve website performance and ensure data security</li>
              <li>Fulfill legal and compliance obligations</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Legal Basis for Processing</h2>
            <p>We collect and process your information on one or more of the following legal bases:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Consent</li>
              <li>Contractual necessity</li>
              <li>Legitimate interest</li>
              <li>Compliance with applicable legal requirements</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. Donations and Financial Data</h2>
            <p>When you make a donation through the platform:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Payment data (e.g., UPI ID, bank details) is collected through secure, third-party payment gateways.</li>
              <li>We do not store full payment or card details.</li>
              <li>Donation records are retained for tax, audit, and legal compliance as per Indian law.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. Consent for Communication</h2>
            <p>
              By providing your contact details, you consent to receive communications from Rashtriya Kisan Manch 
              through email, SMS, WhatsApp, or phone. You may withdraw consent at any time by contacting us or 
              using opt-out mechanisms provided in communications.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Maintain multilingual experience</li>
              <li>Analyze visitor behavior and traffic</li>
              <li>Enhance website design and content delivery</li>
            </ul>
            <p>Users may manage cookie preferences through browser settings.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">7. Data Sharing and Disclosure</h2>
            <p>We do not sell or rent your personal information.</p>
            <p>Data may be shared with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Internal teams and verified local/state-level chapters</li>
              <li>Service providers for hosting, analytics, and email delivery</li>
              <li>Government or legal authorities when required by law</li>
            </ul>
            <p>All third-party service providers are expected to comply with standard data protection practices.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">8. External Links</h2>
            <p>
              Our website may contain links to third-party websites or platforms. We are not responsible for their 
              content or privacy practices. Users are encouraged to review the privacy policies of those websites separately.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">9. Data Retention</h2>
            <p>We retain your data only for as long as necessary for the purposes outlined above.</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Data Type</th>
                    <th className="border p-2 text-left">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Contact form submissions</td>
                    <td className="border p-2">12 months</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Petition and volunteer data</td>
                    <td className="border p-2">Up to 36 months or until project closure</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Donation and financial data</td>
                    <td className="border p-2">As per statutory requirements (typically 7 years)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Inactive data may be anonymized or securely deleted.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">10. Data Security</h2>
            <p>We implement appropriate administrative, technical, and physical safeguards to protect your information, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>SSL encryption</li>
              <li>Secure servers</li>
              <li>Limited access controls</li>
              <li>Routine security monitoring</li>
            </ul>
            <p>Despite best efforts, no internet-based system is completely secure. You assume inherent risks when using online services.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">11. Your Rights</h2>
            <p>As a data subject, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw your consent to data processing</li>
              <li>File a complaint with a relevant regulatory authority</li>
            </ul>
            <p>To exercise these rights, email us at rashtriyakisanmanch@gmail.com.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">12. Children's Privacy</h2>
            <p>
              We do not intentionally collect personal data from children under the age of 13. If you believe such data 
              has been inadvertently collected, please contact us to have it deleted.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">13. Use of Aggregate and Anonymized Data</h2>
            <p>
              We may use anonymized or aggregated information (e.g., total petition signers per district) for research, 
              campaign reporting, and impact communication. This data does not identify individuals and is not shared in 
              a personally identifiable format.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">14. Policy Updates</h2>
            <p>
              This Privacy Policy may be updated periodically. Updates will be posted on this page with an updated effective date. 
              Continued use of the website after any modifications constitutes acceptance of those changes.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">15. Contact Information</h2>
            <p>For questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
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

export default PrivacyPolicy; 