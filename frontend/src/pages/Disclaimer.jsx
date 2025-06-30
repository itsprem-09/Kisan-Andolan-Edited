import React from 'react';

const Disclaimer = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface py-12">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Disclaimer</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <p className="text-sm text-text-secondary">Effective Date: {currentDate}</p>
            <p className="text-sm text-text-secondary">Last Updated: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              This disclaimer ("Disclaimer") governs your use of the website 
              <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline"> https://rashtriyakisanmanch.com</a> ("Website"), 
              operated by Rashtriya Kisan Manch ("we", "us", "our").
            </p>
            <p>
              By accessing or using the Website, you acknowledge that you have read, understood, and agree to be bound by 
              this Disclaimer in full. If you do not agree, please discontinue use of the Website immediately.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. General Information</h2>
            <p>
              The Website is a public platform for the Rashtriya Kisan Manch, a national-level organization advocating for 
              farmers' rights, public policies, rural development, and political awareness. It aims to share information, 
              updates, initiatives, and campaigns in the interest of agricultural communities and public welfare.
            </p>
            <p>All content is provided for informational, educational, and outreach purposes only.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. Not Legal or Professional Advice</h2>
            <p>
              No content published on this Website should be construed as legal, financial, medical, or other professional advice. 
              Users are encouraged to consult qualified professionals for decisions relating to law, finance, or government matters.
            </p>
            <p>
              Rashtriya Kisan Manch assumes no responsibility for how users interpret or act on the content published.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Political Neutrality</h2>
            <p>
              While the platform may express views, publish petitions, or collaborate with leaders aligned with farmer and 
              citizen interests, the organization operates independently and is not affiliated with any political party unless 
              explicitly stated. Any mentions of political leaders, issues, or parties are for awareness, transparency, and 
              advocacy purposes.
            </p>
            <p>
              Views expressed by contributors, volunteers, or speakers are their own and do not necessarily represent the 
              official position of the Manch.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. Accuracy of Information</h2>
            <p>While we strive to keep all content current and accurate, we make no warranties or representations regarding:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Completeness or reliability of the information</li>
              <li>Real-time updates or official status of legislative or policy content</li>
              <li>Uninterrupted or error-free access to the Website</li>
            </ul>
            <p>We reserve the right to modify or remove content at any time without notice.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. Third-Party Links</h2>
            <p>
              The Website may contain links to external websites, platforms, or services. We do not control or endorse the content, 
              terms, or policies of third-party sites. Visiting such links is at your own discretion and risk.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Events, Donations & Volunteer Disclaimers</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Participation in events, campaigns, or training programs is voluntary.</li>
              <li>Donations made through the Website are non-refundable unless specifically stated.</li>
              <li>Volunteer roles do not constitute employment, and any benefits are disclosed explicitly at the time of application.</li>
              <li>We do not guarantee placement, training, or recognition unless officially confirmed.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Rashtriya Kisan Manch shall not be liable for any direct, 
              indirect, incidental, or consequential damages resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>The use or inability to use the Website</li>
              <li>Inaccurate content or misinformation</li>
              <li>Technical issues or data breaches</li>
              <li>User reliance on published material</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">8. User Responsibility</h2>
            <p>
              Users are responsible for ensuring that their use of the Website complies with local laws and regulations. 
              Submission of false information, abusive content, or misuse of platform features may lead to legal consequences 
              or suspension of access.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">9. Contact</h2>
            <p>For questions about this Disclaimer or to report concerns, please contact:</p>
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

export default Disclaimer; 