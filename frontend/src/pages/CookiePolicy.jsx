import React from 'react';

const CookiePolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface py-12">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Cookie Policy</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <p className="text-sm text-text-secondary">Effective Date: {currentDate}</p>
            <p className="text-sm text-text-secondary">Last Updated: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              This Cookie Policy explains how Rashtriya Kisan Manch ("we", "us", or "our") uses cookies and similar 
              technologies on our website <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline">
              https://rashtriyakisanmanch.com</a> ("Website"). By using our Website, you agree to our use of cookies as described in this policy.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
              They help websites recognize your browser and remember certain information about your visit, such as your preferences or previous activity.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>
            <p>We use the following categories of cookies on our Website:</p>
            
            <h3 className="text-xl font-heading font-medium mt-6 mb-3">a. Essential Cookies</h3>
            <p>
              These cookies are necessary for the basic functionality of the site. They enable features like language selection, 
              secure login, form submissions, and page navigation.
            </p>
            <p>Examples:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Session cookies for maintaining logins</li>
              <li>Language preference cookies (e.g., Hindi, English)</li>
            </ul>

            <h3 className="text-xl font-heading font-medium mt-6 mb-3">b. Performance and Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with the Website. They provide information on the most visited pages, 
              time spent, and errors encountered.
            </p>
            <p>
              We use third-party services such as Google Analytics to collect anonymous data for performance monitoring and optimization.
            </p>
            
            <h3 className="text-xl font-heading font-medium mt-6 mb-3">c. Functionality Cookies</h3>
            <p>
              These cookies enhance the usability of the Website by remembering choices you make, such as region selection or volunteer form preferences.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
            <p>In addition to our own cookies, we may use cookies from third-party services for features such as:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Social media integrations (e.g., share buttons, embedded posts)</li>
              <li>Donation or payment gateways</li>
              <li>External form processors (e.g., Google Forms, Airtable, etc., where applicable)</li>
            </ul>
            <p>Please note that these third-party cookies are governed by their own privacy and cookie policies.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. How to Manage Cookies</h2>
            <p>
              You have the right to accept or reject cookies. Most web browsers allow you to control cookies through settings such as:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Enabling or disabling all cookies</li>
              <li>Blocking third-party cookies</li>
              <li>Clearing existing cookies</li>
            </ul>
            <p>
              To modify your cookie preferences, refer to your browser's help section. If you disable certain cookies, 
              some parts of the Website may not function properly.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in legal or operational requirements. 
              The latest version will always be posted on this page with the updated effective date.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p>If you have any questions about our use of cookies or this policy, you may contact:</p>
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

export default CookiePolicy; 