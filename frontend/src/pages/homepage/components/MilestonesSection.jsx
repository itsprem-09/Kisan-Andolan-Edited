import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { getKeyMilestones } from 'services/timelineService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Image from 'components/AppImage';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import TranslateText from '../../../components/TranslateText';

const MilestonesSection = () => {
  const { language, getTranslation } = useLanguage();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await getKeyMilestones();
        
        if (response && response.data) {
          // Process and format the timeline data
          const processedData = response.data.map(item => ({
            id: item._id,
            year: new Date(item.date).getFullYear().toString(),
            title: item.title,
            description: item.description,
            date: new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isKeyMilestone: item.isKeyMilestone || false,
            gallery: item.gallery || []
          }));
          
          // Sort by date in descending order (newest first)
          const sortedData = processedData.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          
          // Take only the 5 most recent milestones
          const recentMilestones = sortedData.slice(0, 5);
          setMilestones(recentMilestones);
        } else {
          setMilestones([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching milestone data:', err);
        setError(err);
        setLoading(false);
        // Fall back to default data if there's an error
        setMilestones(content[language].milestones);
      }
    };

    fetchMilestones();
  }, [language]);

  // Toggle expanded milestone
  const toggleExpanded = (id) => {
    if (expandedMilestone === id) {
      setExpandedMilestone(null);
    } else {
      setExpandedMilestone(id);
    }
  };

  const content = {
    en: {
      title: "Our Journey",
      subtitle: "Key milestones in our mission to transform agriculture",
      viewTimeline: "View Complete Timeline",
      knowMore: "Know More",
      showLess: "Show Less",
      milestones: [
        {
          year: "2003",
          title: "Foundation",
          description: "Kisan Andolan was established with a vision to empower farmers and transform rural communities."
        },
        {
          year: "2010",
          title: "First Training Center",
          description: "Opened our first agricultural training center, reaching over 1,000 farmers in the first year."
        },
        {
          year: "2015",
          title: "Technology Integration",
          description: "Launched digital platforms and mobile apps to connect farmers with markets and resources."
        },
        {
          year: "2020",
          title: "Pandemic Response",
          description: "Adapted programs to support farmers during COVID-19, ensuring food security and livelihoods."
        },
        {
          year: "2024",
          title: "Sustainable Future",
          description: "Expanding renewable energy projects and climate-smart agriculture across 500+ villages."
        }
      ]
    },
    hi: {
      title: "हमारी यात्रा",
      subtitle: "कृषि को बदलने के हमारे मिशन में मुख्य मील के पत्थर",
      viewTimeline: "पूरी समयसीमा देखें",
      knowMore: "और जानें",
      showLess: "कम दिखाएँ",
      milestones: [
        {
          year: "2003",
          title: "स्थापना",
          description: "किसान आंदोलन की स्थापना किसानों को सशक्त बनाने और ग्रामीण समुदायों को बदलने के दृष्टिकोण के साथ की गई।"
        },
        {
          year: "2010",
          title: "पहला प्रशिक्षण केंद्र",
          description: "हमारा पहला कृषि प्रशिक्षण केंद्र खोला, पहले वर्ष में 1,000 से अधिक किसानों तक पहुंचे।"
        },
        {
          year: "2015",
          title: "प्रौद्योगिकी एकीकरण",
          description: "किसानों को बाजारों और संसाधनों से जोड़ने के लिए डिजिटल प्लेटफॉर्म और मोबाइल ऐप लॉन्च किए।"
        },
        {
          year: "2020",
          title: "महामारी प्रतिक्रिया",
          description: "COVID-19 के दौरान किसानों का समर्थन करने के लिए कार्यक्रमों को अनुकूलित किया, खाद्य सुरक्षा और आजीविका सुनिश्चित की।"
        },
        {
          year: "2024",
          title: "टिकाऊ भविष्य",
          description: "500+ गांवों में नवीकरणीय ऊर्जा परियोजनाओं और जलवायु-स्मार्ट कृषि का विस्तार।"
        }
      ]
    }
  };

  // Use real data from API if available, otherwise fall back to hardcoded content
  const displayMilestones = milestones.length > 0 ? milestones : content[language].milestones;

  // Create pairs of milestones for the desktop view
  const createMilestonePairs = (milestones) => {
    const pairs = [];
    for (let i = 0; i < milestones.length; i += 2) {
      // Create a pair with the current milestone and the next one (if exists)
      pairs.push({
        left: milestones[i],
        right: i + 1 < milestones.length ? milestones[i + 1] : null
      });
    }
    return pairs;
  };

  const milestonePairs = createMilestonePairs(displayMilestones);

  if (loading) {
    return (
      <section className="py-16 md:pt-3 md:pb-24 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
              {content[language].subtitle}
            </p>
          </div>
          <div className="flex justify-center py-12">
            <LoadingSpinner size={40} message={getTranslation('loading')} />
          </div>
        </div>
      </section>
    );
  }

  if (error && displayMilestones.length === 0) {
    return (
      <section className="py-16 md:pt-3 md:pb-24 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
              {content[language].subtitle}
            </p>
            
            <Link
              to="/andolan-timeline-page"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <Icon name="Clock" size={20} />
              <span>{content[language].viewTimeline}</span>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-text-secondary">{getTranslation('error')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:pt-3 md:pb-24 bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {content[language].title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
            {content[language].subtitle}
          </p>
          
          <Link
            to="/andolan-timeline-page"
            className="btn-outline inline-flex items-center space-x-2"
          >
            <Icon name="Clock" size={20} />
            <span>{content[language].viewTimeline}</span>
          </Link>
        </div>

        {/* Desktop Timeline */}
        <div className="relative hidden md:block">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-accent h-full" />
          
          <div className="space-y-24">
            {milestonePairs.map((pair, pairIndex) => (
              <div key={`pair-${pairIndex}`} className="relative">
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-6 h-6 bg-primary rounded-full border-4 border-surface shadow-lg" />
                </div>
                
                {/* Content - arranged in two columns */}
                <div className="flex justify-between items-center">
                  {/* Left Content */}
                  <div className="w-5/12 pr-16 text-right">
                    <div className="card p-4 bg-white rounded-lg shadow-sm">
                      <div className="mb-4">
                        <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-lg font-bold">
                          {pair.left.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                        <TranslateText>{pair.left.title}</TranslateText>
                      </h3>
                      {/* Show image if available */}
                      {pair.left.gallery && pair.left.gallery.length > 0 && (
                        <div className="mb-3 rounded-lg overflow-hidden h-40">
                          <Image 
                            src={pair.left.gallery[0].filePath} 
                            alt={pair.left.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column (Spacer or Content) */}
                  <div className="w-5/12 pl-16">
                    {pair.right ? (
                      <div className="card p-4 bg-white rounded-lg shadow-sm">
                        <div className="mb-4">
                          <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-lg font-bold">
                            {pair.right.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                          <TranslateText>{pair.right.title}</TranslateText>
                        </h3>
                        {/* Show image if available */}
                        {pair.right.gallery && pair.right.gallery.length > 0 && (
                          <div className="mb-3 rounded-lg overflow-hidden h-40">
                            <Image 
                              src={pair.right.gallery[0].filePath} 
                              alt={pair.right.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div></div> // Empty placeholder for layout balance
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Timeline */}
        <div className="md:hidden">
          <div className="space-y-8">
            {displayMilestones.map((milestone) => (
              <div key={milestone.id || milestone.year} className="relative pl-8 border-l-2 border-primary">
                <div className="absolute left-[-9px] top-0">
                  <div className="w-4 h-4 bg-primary rounded-full" />
                </div>
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                  {milestone.year}
                </span>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  <TranslateText>{milestone.title}</TranslateText>
                </h3>
                <p className="text-sm text-text-secondary">
                  <TranslateText>{milestone.description}</TranslateText>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;