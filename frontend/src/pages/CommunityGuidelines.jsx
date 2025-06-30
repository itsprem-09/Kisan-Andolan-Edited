import React from 'react';

const CommunityGuidelines = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface py-12">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Community Guidelines</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <p className="text-sm text-text-secondary">Effective Date: {currentDate}</p>
            <p className="text-sm text-text-secondary">Last Updated: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At Rashtriya Kisan Manch, we believe in meaningful, inclusive, and respectful dialogue. These Community Guidelines 
              are established to ensure that all interactions on <a href="https://rashtriyakisanmanch.com" className="text-primary hover:underline">
              https://rashtriyakisanmanch.com</a> are safe, civil, and aligned with our shared purpose: advocacy, empowerment, 
              and unity for farmers and the broader community.
            </p>
            <p>
              By accessing or engaging with our Website or any associated platform (such as campaigns, petitions, volunteer activities, 
              or discussions), you agree to follow these Guidelines.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">1. Respectful Conduct</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Treat others with dignity, even if you disagree.</li>
              <li>Do not use hate speech, personal attacks, abusive language, or discriminatory remarks based on religion, caste, gender, political belief, or region.</li>
              <li>Engage in constructive criticism and fact-based discussions.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">2. Truthfulness and Responsibility</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Do not post false or misleading information, impersonate others, or submit fraudulent forms or documents.</li>
              <li>Only share verified facts, especially when posting petitions or public appeals.</li>
              <li>Take responsibility for the content you submit and ensure it does not infringe on the rights of others.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">3. Safe Participation</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Do not post content that promotes or glorifies violence, criminal activity, or self-harm.</li>
              <li>Do not spam or flood forms, comments, or volunteer signups.</li>
              <li>Avoid sharing personal phone numbers, addresses, or financial details publicly.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">4. No Political or Commercial Promotion</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Do not use the platform to promote political parties, commercial products, or unrelated agendas.</li>
              <li>Campaign content must serve public interest or community benefit only.</li>
              <li>Collaboration with political leaders (if any) is issue-based and must be pre-approved by the Rashtriya Kisan Manch team.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">5. Respect Volunteer and Organizer Roles</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Follow the instructions provided by verified coordinators or administrators.</li>
              <li>Do not pose as an official representative of the Manch unless officially designated.</li>
              <li>Do not disrupt training sessions, meetings, or online events.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">6. Data Protection and Privacy</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Do not misuse contact information or personal data collected during campaigns or volunteering.</li>
              <li>Respect others' privacy and never share someone else's data without their clear consent.</li>
              <li>Abide by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and 
                  <a href="/data-protection" className="text-primary hover:underline"> Data Protection Policy</a> at all times.</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">7. Reporting and Enforcement</h2>
            <p>We encourage users to report violations of these guidelines. Our moderation team may take the following actions:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Issue warnings or remove content</li>
              <li>Suspend or block user access to forms, discussions, or tools</li>
              <li>Report unlawful activity to legal authorities, if necessary</li>
            </ul>
            <p>Decisions made by our moderation or administrative team are final.</p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">8. Applicability</h2>
            <p>These Guidelines apply to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>All users, volunteers, petitioners, donors, and contributors on the Website</li>
              <li>Comments, campaign pages, online/offline training groups, and feedback channels</li>
              <li>Any content or interaction associated with Rashtriya Kisan Manch</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">9. Updates</h2>
            <p>
              These Guidelines may be updated periodically to reflect changes in our platform, user feedback, or legal requirements. 
              The most recent version will always be available on this page.
            </p>

            <h2 className="text-2xl font-heading font-semibold mt-8 mb-4">10. Contact</h2>
            <p>To report a violation or ask questions related to community conduct, please write to:</p>
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

export default CommunityGuidelines; 