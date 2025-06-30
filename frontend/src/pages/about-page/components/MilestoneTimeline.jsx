import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { getKeyMilestones } from 'services/timelineService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Image from 'components/AppImage';
import { motion } from 'framer-motion';

const MilestoneTimeline = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Default milestones as fallback
  const defaultMilestones = [
    {
      year: 2003,
      title: "Foundation",
      description: "Kisan Andolan founded by Dr. Rajesh Kumar in Uttar Pradesh",
      icon: "Flag"
    },
    {
      year: 2007,
      title: "First Training Center",
      description: "Opened our first farmer training center in Lucknow",
      icon: "Home"
    },
    {
      year: 2012,
      title: "National Expansion",
      description: "Expanded operations to 8 states across India",
      icon: "Map"
    },
    {
      year: 2015,
      title: "Policy Influence",
      description: "Successfully advocated for changes to the national agricultural policy",
      icon: "FileText"
    },
    {
      year: 2018,
      title: "Sustainability Initiative",
      description: "Launched comprehensive program for sustainable farming practices",
      icon: "Leaf"
    },
    {
      year: 2023,
      title: "Digital Transformation",
      description: "Implemented digital platforms to reach 100,000+ farmers",
      icon: "Smartphone"
    }
  ];

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await getKeyMilestones();
        
        if (response && response.data && response.data.length > 0) {
          // Process and format the timeline data
          const processedData = response.data.map(item => ({
            id: item._id,
            year: new Date(item.date).getFullYear(),
            title: item.title,
            description: item.description,
            gallery: item.gallery || [],
            // Map some default icons based on the title or use a default icon
            icon: getIconForMilestone(item.title)
          }));
          
          // Sort by year in ascending order
          const sortedData = processedData.sort((a, b) => a.year - b.year);
          
          // Take up to 6 milestones
          const keyMilestones = sortedData.slice(0, 6);
          setMilestones(keyMilestones);
        } else {
          // Use default milestones if no data is returned
          setMilestones(defaultMilestones);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching milestone data:', err);
        setError(err);
        setLoading(false);
        // Fall back to default data if there's an error
        setMilestones(defaultMilestones);
      }
    };

    fetchMilestones();
  }, []);

  // Helper function to assign icons based on milestone title/content
  const getIconForMilestone = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('found') || titleLower.includes('start')) return 'Flag';
    if (titleLower.includes('center') || titleLower.includes('facility')) return 'Home';
    if (titleLower.includes('expan') || titleLower.includes('national')) return 'Map';
    if (titleLower.includes('policy') || titleLower.includes('advocat')) return 'FileText';
    if (titleLower.includes('sustain') || titleLower.includes('green') || titleLower.includes('environment')) return 'Leaf';
    if (titleLower.includes('digital') || titleLower.includes('online') || titleLower.includes('tech')) return 'Smartphone';
    if (titleLower.includes('partner') || titleLower.includes('collab')) return 'Handshake';
    if (titleLower.includes('train') || titleLower.includes('educat')) return 'GraduationCap';
    if (titleLower.includes('award') || titleLower.includes('recogn')) return 'Award';
    
    // Default icon if no match
    return 'Calendar';
  };

  // Toggle expanded milestone
  const toggleExpanded = (id) => {
    if (expandedMilestone === id) {
      setExpandedMilestone(null);
    } else {
      setExpandedMilestone(id);
    }
  };

  // Create pairs of milestones for the alternating display
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

  // Display loading state
  if (loading) {
    return (
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-primary">Key Milestones</h2>
          <Link 
            to="/andolan-timeline-page" 
            className="text-primary hover:text-secondary transition-smooth flex items-center space-x-2"
          >
            <span>View Full Timeline</span>
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner size={40} message="Loading milestone data..." />
        </div>
      </section>
    );
  }

  // Display error state (but still show timeline link)
  if (error && milestones.length === 0) {
    return (
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-primary">Key Milestones</h2>
          <Link 
            to="/andolan-timeline-page" 
            className="text-primary hover:text-secondary transition-smooth flex items-center space-x-2"
          >
            <span>View Full Timeline</span>
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-text-secondary">Unable to load milestone data. Please try again later.</p>
        </div>
      </section>
    );
  }

  const milestonePairs = createMilestonePairs(milestones);

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-heading font-bold text-primary">Key Milestones</h2>
        <Link 
          to="/andolan-timeline-page" 
          className="text-primary hover:text-secondary transition-smooth flex items-center space-x-2"
        >
          <span>View Full Timeline</span>
          <Icon name="ArrowRight" size={18} />
        </Link>
      </div>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent -ml-px z-0"></div>
        
        {/* Desktop Timeline - Alternating Layout */}
        <div className="hidden md:block">
          <div className="space-y-16">
            {milestonePairs.map((pair, pairIndex) => (
              <div key={`pair-${pairIndex}`} className="relative">
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-4 border-primary flex items-center justify-center shadow-md">
                    <Icon name={pair.left.icon} size={20} className="text-primary" />
                  </div>
                </div>
                
                {/* Content - arranged in two columns */}
                <div className="flex justify-between items-center">
                  {/* Left Content */}
                  <div className="w-5/12 pr-12 text-right">
                    <div className="card p-6 bg-surface rounded-lg shadow-md">
                      {/* Year Badge */}
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                        <span className="text-lg font-bold text-primary">{pair.left.year}</span>
                      </div>
                      
                      <h3 className="text-xl font-heading font-semibold text-primary mb-3">{pair.left.title}</h3>
                      
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
                      
                      {/* Description toggle */}
                      <div>
                        {expandedMilestone === pair.left.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-text-secondary mb-3 text-left"
                          >
                            {pair.left.description}
                          </motion.div>
                        )}
                        
                        <button
                          onClick={() => toggleExpanded(pair.left.id)}
                          className="inline-flex items-center text-primary hover:text-secondary transition-smooth"
                        >
                          <span>{expandedMilestone === pair.left.id ? 'Show Less' : 'Know More'}</span>
                          <Icon 
                            name={expandedMilestone === pair.left.id ? "ChevronUp" : "ChevronDown"} 
                            size={16} 
                            className="ml-1" 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="w-5/12 pl-12 text-left">
                    {pair.right && (
                      <div className="card p-6 bg-surface rounded-lg shadow-md">
                        {/* Year Badge */}
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                          <span className="text-lg font-bold text-primary">{pair.right.year}</span>
                        </div>
                        
                        <h3 className="text-xl font-heading font-semibold text-primary mb-3">{pair.right.title}</h3>
                        
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
                        
                        {/* Description toggle */}
                        <div>
                          {expandedMilestone === pair.right.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-text-secondary mb-3"
                            >
                              {pair.right.description}
                            </motion.div>
                          )}
                          
                          <button
                            onClick={() => toggleExpanded(pair.right.id)}
                            className="inline-flex items-center text-primary hover:text-secondary transition-smooth"
                          >
                            <span>{expandedMilestone === pair.right.id ? 'Show Less' : 'Know More'}</span>
                            <Icon 
                              name={expandedMilestone === pair.right.id ? "ChevronUp" : "ChevronDown"} 
                              size={16} 
                              className="ml-1" 
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline - Stacked Layout */}
        <div className="md:hidden space-y-12">
          {milestones.map((milestone, index) => (
            <div key={milestone.id || index} className="relative z-10">
              <div className="flex flex-col items-start">
                {/* Timeline Node */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-4 border-primary flex items-center justify-center shadow-md">
                    <Icon name={milestone.icon} size={20} className="text-primary" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="ml-20 mt-2 w-full">
                  <div className="bg-surface rounded-lg p-6 shadow-md">
                    {/* Year Badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                      <span className="text-lg font-bold text-primary">{milestone.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-heading font-semibold text-primary mb-3">{milestone.title}</h3>
                    
                    {/* Show image if available */}
                    {milestone.gallery && milestone.gallery.length > 0 && (
                      <div className="mb-3 rounded-lg overflow-hidden h-40">
                        <Image 
                          src={milestone.gallery[0].filePath} 
                          alt={milestone.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    
                    {/* Description toggle */}
                    <div>
                      {expandedMilestone === milestone.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-text-secondary mb-3"
                        >
                          {milestone.description}
                        </motion.div>
                      )}
                      
                      <button
                        onClick={() => toggleExpanded(milestone.id)}
                        className="inline-flex items-center text-primary hover:text-secondary transition-smooth"
                      >
                        <span>{expandedMilestone === milestone.id ? 'Show Less' : 'Know More'}</span>
                        <Icon 
                          name={expandedMilestone === milestone.id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="ml-1" 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestoneTimeline;