import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';
import { getAboutContent } from 'services/aboutService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { useLanguage } from 'contexts/LanguageContext';

const ImpactMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [counts, setCounts] = useState({
    farmers: 0,
    villages: 0,
    programs: 0,
    states: 0
  });

  const { language } = useLanguage();

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await getAboutContent();
        
        if (response && response.data) {
          setAboutData(response.data);
        }
      } catch (err) {
        console.error('Error fetching about content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Set targets from API data or use defaults
  const targets = aboutData?.impactMetrics || {
    farmers: 100000,
    villages: 1250,
    programs: 45,
    states: 18
  };

  // Handle visibility detection for animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const section = document.getElementById('impact-metrics');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Animate counts when section becomes visible
  useEffect(() => {
    if (isVisible && aboutData) {
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;

      const incrementValues = {
        farmers: targets.farmers / steps,
        villages: targets.villages / steps,
        programs: targets.programs / steps,
        states: targets.states / steps
      };

      const timer = setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = { ...prevCounts };
          let completed = true;

          for (const key in newCounts) {
            if (newCounts[key] < targets[key]) {
              newCounts[key] = Math.min(newCounts[key] + incrementValues[key], targets[key]);
              completed = false;
            }
          }

          if (completed) clearInterval(timer);
          return newCounts;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible, aboutData, targets]);

   // Get current content based on selected language
  const getTranslatedContent = (infoBox, field) => {
    if (language === 'hi' && infoBox[`hindi_${field}`]) {
      return infoBox[`hindi_${field}`];
    }
    return infoBox[field];
  };

  // Define metrics for display
  const metrics = [
    {
      icon: 'Users',
      label: 'Farmers Reached',
      value: Math.round(counts.farmers).toLocaleString(),
      suffix: '+',
      color: 'primary'
    },
    {
      icon: 'Home',
      label: 'Villages Covered',
      value: Math.round(counts.villages).toLocaleString(),
      suffix: '+',
      color: 'secondary'
    },
    {
      icon: 'Calendar',
      label: 'Programs Implemented',
      value: Math.round(counts.programs).toLocaleString(),
      suffix: '',
      color: 'secondary'
    },
    {
      icon: 'Map',
      label: 'States Active',
      value: Math.round(counts.states).toLocaleString(),
      suffix: '',
      color: 'primary'
    },
  ];
  
  if (loading) {
    return (
      <section id="impact-metrics" className="mb-20">
        <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Our Impact</h2>
        <div className="flex justify-center">
          <LoadingSpinner size={40} />
        </div>
      </section>
    );
  }

  return (
    <section id="impact-metrics" className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="card-elevated text-center p-6">
            <div className={`w-16 h-16 bg-${metric.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon name={metric.icon} size={32} color="white" />
            </div>
            <div className="text-4xl font-heading font-bold text-primary mb-2">
              {metric.value}{metric.suffix}
            </div>
            <p className="text-text-secondary">{metric.label}</p>
          </div>
        ))}
      </div>
      
     {aboutData?.infoBoxes && aboutData.infoBoxes.map((infoBox, index) => (
        <div key={index} className="mt-10 bg-accent bg-opacity-20 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Icon name={infoBox.icon} size={24} className="text-primary mt-1" />
            <div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                {getTranslatedContent(infoBox, 'title')}
              </h3>
              <p className="text-text-secondary">
                {getTranslatedContent(infoBox, 'description')}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Fallback if no infoBoxes are found */}
      {(!aboutData?.infoBoxes || aboutData.infoBoxes.length === 0) && (
        <div className="mt-10 bg-accent bg-opacity-20 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Icon name="TrendingUp" size={24} className="text-primary mt-1" />
            <div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">Sustainable Growth</h3>
              <p className="text-text-secondary">
                Our movement has been growing steadily since its inception, with a 35% increase in farmer participation in the last three years alone. We're committed to reaching 250,000 farmers by 2026 through expanded programs and regional partnerships.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImpactMetrics;