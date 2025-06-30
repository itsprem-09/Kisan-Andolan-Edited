import React from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  return (
    <div className="bg-surface py-12">
      <div className="container-custom">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">Frequently Asked Questions (FAQ)</h1>
          <p className="text-lg text-text-secondary font-medium mb-8">Rashtriya Kisan Manch – For Farmers, For Bharat</p>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">1. What is Rashtriya Kisan Manch?</h3>
              <p className="text-text-secondary">
                Rashtriya Kisan Manch is a national platform dedicated to raising the voices of farmers and rural communities across India. 
                We advocate for farmer rights, policy reforms, fair pricing, and sustainable development through peaceful campaigns, 
                public awareness, petitions, and grassroots mobilization.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">2. Is Rashtriya Kisan Manch affiliated with any political party?</h3>
              <p className="text-text-secondary">
                No. Rashtriya Kisan Manch is an independent and non-partisan initiative. While we may collaborate with political 
                representatives on issue-based matters that benefit farmers and citizens, we do not represent or endorse any political party.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">3. How can I support the cause?</h3>
              <p className="text-text-secondary mb-2">You can support us by:</p>
              <ul className="list-disc pl-6 text-text-secondary">
                <li>Signing active petitions</li>
                <li>Participating in online and offline campaigns</li>
                <li>Volunteering for awareness and outreach</li>
                <li>Donating to help fund our programs</li>
                <li>Sharing our initiatives on social media platforms</li>
              </ul>
              <p className="text-text-secondary mt-2">Visit our homepage or campaign section to get involved.</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">4. How can I volunteer?</h3>
              <p className="text-text-secondary">
                Visit the "Volunteer" section on our website and fill out the registration form. Once submitted, our team will 
                review your details and contact you via email or phone for onboarding, orientation, or local coordination opportunities.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">5. Do you provide training to volunteers?</h3>
              <p className="text-text-secondary">
                Yes. We offer basic orientation sessions and, when required, issue-based training or digital workshops to help volunteers 
                understand the cause, communication ethics, and local action plans.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">6. Where do the donations go?</h3>
              <p className="text-text-secondary mb-2">Donations help fund:</p>
              <ul className="list-disc pl-6 text-text-secondary">
                <li>Public interest campaigns</li>
                <li>Farmer support outreach</li>
                <li>Educational material printing</li>
                <li>Legal awareness sessions</li>
                <li>Volunteer mobilization and tech infrastructure</li>
              </ul>
              <p className="text-text-secondary mt-2">
                All transactions are processed through secure gateways, and we strive to maintain transparency with periodic updates and reports.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">7. How can I sign a petition?</h3>
              <p className="text-text-secondary mb-2">To sign a petition:</p>
              <ul className="list-disc pl-6 text-text-secondary">
                <li>Visit the Petitions section</li>
                <li>Select the cause you support</li>
                <li>Fill in your details and click Sign/Support</li>
                <li>Your support will be recorded and added to the ongoing public count</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">8. Is my data secure?</h3>
              <p className="text-text-secondary">
                Yes. We follow strict data protection practices. Your personal information is never sold or misused. 
                Please read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and 
                <Link to="/data-protection" className="text-primary hover:underline"> Data Protection Policy</Link> for complete details.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">9. Can I represent the Manch in my village or district?</h3>
              <p className="text-text-secondary">
                We welcome local coordinators, but official representation is assigned only after vetting and training. 
                Please reach out via the Contact Us or Volunteer section, and our state team will respond accordingly.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">10. How can I contact Rashtriya Kisan Manch?</h3>
              <p className="text-text-secondary mb-2">You can reach us via:</p>
              <ul className="list-none pl-0 text-text-secondary space-y-1">
                <li><span className="font-medium">Email:</span> rashtriyakisanmanch@gmail.com</li>
                <li><span className="font-medium">Phone:</span> +91-7860411111</li>
                <li><span className="font-medium">Contact Form:</span> Available on the website</li>
                <li><span className="font-medium">Address:</span> 1, Paper Mill Colony, Valmiki Nagar, Lucknow, Uttar Pradesh, 226006</li>
              </ul>
              <p className="text-text-secondary mt-2">We aim to respond to all queries within 48 hours.</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">11. Is there a membership fee?</h3>
              <p className="text-text-secondary">
                No. Joining or volunteering with Rashtriya Kisan Manch is completely free. However, you may choose to contribute 
                voluntarily through donations to support operational costs or campaign materials.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border-l-4 border-primary">
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">12. Can I share content or ideas?</h3>
              <p className="text-text-secondary">
                Yes, we welcome suggestions and local success stories related to agriculture, rural welfare, or grassroots activism. 
                You can share via email or submit content through the Get Involved section. Final publication is subject to internal review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 