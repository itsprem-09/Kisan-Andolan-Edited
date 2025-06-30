import React from 'react';

const DataProtectionPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface py-12">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Data Protection Policy</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <p className="text-sm text-text-secondary">Effective Date: {currentDate}</p>
            <p className="text-sm text-text-secondary">Last Updated: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At Rashtriya Kisan Manch, we are committed to protecting the privacy, integrity, and security of all personal data 
              collected from users of our website <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline">
              https://rashtriyakisanmanch.com</a>. This policy outlines the principles, responsibilities, and processes we follow 
              to ensure lawful and transparent data handling.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. Purpose</h2>
            <p>This policy ensures that personal information collected through our website and related services is:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Handled responsibly and securely</li>
              <li>Used solely for legitimate and clearly communicated purposes</li>
              <li>Protected from unauthorized access, misuse, or disclosure</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. Scope</h2>
            <p>This policy applies to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>All users and visitors of the Website</li>
              <li>All types of personal data collected via online forms, donations, petitions, registration modules, or direct communication</li>
              <li>All team members, volunteers, and third-party service providers with access to user data</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Legal Basis for Data Collection</h2>
            <p>We collect and process personal data under the following legal bases:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>User Consent: Provided through voluntary form submissions or sign-ups</li>
              <li>Legal Obligation: For compliance with Indian laws and statutory reporting</li>
              <li>Legitimate Interest: To improve services, conduct outreach, and support campaigns</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. Data We Collect</h2>
            <p>Personal data may include, but is not limited to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Full name</li>
              <li>Email address and mobile number</li>
              <li>Geographic location (district, state)</li>
              <li>Political or social affiliations (only if voluntarily disclosed)</li>
              <li>ID proof or documents (only if required and with consent)</li>
              <li>Bank details or UPI ID for donations (processed via secure third-party gateways)</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. How We Use the Data</h2>
            <p>Your data may be used for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Sending updates about events, campaigns, or petitions</li>
              <li>Responding to queries or requests</li>
              <li>Volunteer coordination and training outreach</li>
              <li>Generating reports for internal and public transparency (in anonymized form)</li>
              <li>Complying with donation-related legal obligations</li>
              <li>Improving website and user experience</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Data Security Measures</h2>
            <p>We implement industry-standard security practices, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Secure Socket Layer (SSL) encryption on our Website</li>
              <li>Role-based access control for internal data handling</li>
              <li>Regular data backups</li>
              <li>Secure integration with third-party services (e.g., payment gateways, analytics tools)</li>
              <li>Periodic review of data handling procedures</li>
            </ul>
            <p>All staff and volunteers handling user data are bound by confidentiality agreements and data protection responsibilities.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">7. Data Sharing and Third Parties</h2>
            <p>We do not sell or rent personal data.</p>
            <p>Data may be shared only with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Internal teams for campaign coordination</li>
              <li>Verified state or district-level chapters</li>
              <li>Law enforcement or government authorities (only if legally required)</li>
              <li>Reputable third-party processors such as payment gateways or cloud platforms under strict contractual terms</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">8. User Rights</h2>
            <p>Under this policy, users have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Access personal data held about them</li>
              <li>Request correction or update of their information</li>
              <li>Withdraw consent to specific uses of their data</li>
              <li>Request deletion of personal data (where legally permissible)</li>
              <li>File complaints with relevant authorities in case of misuse or breach</li>
            </ul>
            <p>To exercise your rights, contact us at rashtriyakisanmanch@gmail.com.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">9. Data Retention</h2>
            <p>Data is retained only for as long as necessary, based on its purpose and applicable legal requirements.</p>
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
                    <td className="border p-2">Contact form responses</td>
                    <td className="border p-2">12 months</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Volunteer data</td>
                    <td className="border p-2">Until program completion + 6 months</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Petition data</td>
                    <td className="border p-2">Until campaign end or 3 years max</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Donation data</td>
                    <td className="border p-2">7 years (as per tax/accounting law)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Data may be anonymized for archival or reporting purposes.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">10. Breach Notification</h2>
            <p>In the event of a confirmed data breach that poses a risk to individual rights, we will:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Notify affected users within 72 hours</li>
              <li>Report the breach to applicable legal or cyber authorities</li>
              <li>Document and investigate the incident thoroughly</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">11. Updates to This Policy</h2>
            <p>
              We may update this Data Protection Policy to reflect changes in law, technology, or practices. 
              Any changes will be posted on this page with an updated effective date.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">12. Contact Us</h2>
            <p>For data access requests, privacy concerns, or security incidents, please contact:</p>
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

export default DataProtectionPolicy; 