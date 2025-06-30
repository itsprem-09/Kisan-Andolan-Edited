import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import TranslateText from '../components/TranslateText';

const ExampleTranslatedPage = () => {
  const { getTranslation } = useLanguage();
  
  // Static content will use predefined translations
  const staticTitle = getTranslation('about');
  
  // Dynamic content that will be translated via Google Translate API
  const dynamicContent = {
    paragraph1: "This is dynamic content that will be translated using Google Translate API. This approach is ideal for content that changes frequently or is loaded from a database.",
    paragraph2: "Google Translate handles complex sentences and maintains the overall meaning of the text while translating to different languages.",
    bulletPoints: [
      "Point 1: Dynamic translation works well for user-generated content",
      "Point 2: It can translate large blocks of text efficiently",
      "Point 3: The original text is preserved and can be restored when switching back to English"
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{staticTitle}</h1>
      
      {/* Static UI elements use getTranslation */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">{getTranslation('informationCenter')}</h2>
        <p>{getTranslation('becomeMember')}</p>
      </div>
      
      {/* Dynamic content uses the TranslateText component */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          <TranslateText>Dynamic Content Section</TranslateText>
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            <TranslateText>{dynamicContent.paragraph1}</TranslateText>
          </p>
          
          <p className="text-gray-700">
            <TranslateText>{dynamicContent.paragraph2}</TranslateText>
          </p>
          
          <ul className="list-disc pl-5 space-y-2">
            {dynamicContent.bulletPoints.map((point, index) => (
              <li key={index} className="text-gray-700">
                <TranslateText>{point}</TranslateText>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Example of longer dynamic content */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-3">
          <TranslateText>Example Article</TranslateText>
        </h3>
        <TranslateText>
          The Kishan Andolan movement represents a significant chapter in India's agricultural advocacy. 
          Founded on principles of fair treatment and sustainable farming practices, the movement has grown
          to become a voice for millions of farmers across the country. Through peaceful protests, community
          organizing, and policy engagement, Kishan Andolan works to ensure that agricultural communities
          receive equitable compensation for their produce and access to resources necessary for successful farming.
          The movement also emphasizes ecological responsibility, promoting farming methods that preserve
          the environment for future generations. As challenges in the agricultural sector evolve, Kishan Andolan
          continues to adapt its strategies while maintaining its core commitment to the wellbeing of India's farmers.
        </TranslateText>
      </div>
    </div>
  );
};

export default ExampleTranslatedPage; 