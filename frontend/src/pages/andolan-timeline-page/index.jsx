import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from 'components/ui/Breadcrumb';
import { getTimelines } from 'services/timelineService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Icon from 'components/AppIcon';
import { useLanguage } from 'contexts/LanguageContext';
import TranslateText from 'components/TranslateText';
import { translateAchievement } from 'utils/translationUtils';

import TimelineNode from './components/TimelineNode';
import MilestoneCard from './components/MilestoneCard';
import FilterControls from './components/FilterControls';
import ProgressIndicator from './components/ProgressIndicator';

const AndolanTimelinePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'decade'
  const [timelineData, setTimelineData] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
  ]);
  const [decades, setDecades] = useState([]);
  const [error, setError] = useState(null);
  const timelineRef = useRef(null);
  const { getTranslation, language } = useLanguage();

  // Hindi translations for breadcrumb navigation
  const breadcrumbItems = [
    { label: language === 'hi' ? 'होम' : 'Home', path: '/' },
    { label: language === 'hi' ? 'आंदोलन की समयरेखा' : 'Andolan Timeline', path: '/andolan-timeline' }
  ];

  // Hindi translations for page sections
  const pageTranslations = {
    pageTitle: {
      en: 'Andolan Timeline',
      hi: 'आंदोलन की समयरेखा'
    },
    pageDescription: {
      en: 'Explore the journey and evolution of our movement through key events, milestones, and achievements that have shaped the Kisan Andolan.',
      hi: 'किसान आंदोलन के इतिहास और विकास को प्रमुख घटनाओं, मील के पत्थरों और उपलब्धियों के माध्यम से जानें।'
    },
    keyMilestones: {
      en: 'Key Milestones',
      hi: 'प्रमुख मील के पत्थर'
    },
    timeline: {
      en: 'Timeline',
      hi: 'समयरेखा'
    },
    noTimelineData: {
      en: 'No timeline data available yet',
      hi: 'अभी तक कोई समयरेखा डेटा उपलब्ध नहीं है'
    },
    andolanHistory: {
      en: 'Andolan History',
      hi: 'आंदोलन का इतिहास'
    },
    navigateLeft: {
      en: 'Navigate Left',
      hi: 'बाएँ जाएं'
    },
    navigateRight: {
      en: 'Navigate Right',
      hi: 'दाएं जाएं'
    }
  };

  // Helper function to get translation based on current language
  const getPageText = (key) => {
    return language === 'hi' ? pageTranslations[key].hi : pageTranslations[key].en;
  };

  // Save selected timeline position to localStorage
  useEffect(() => {
    if (selectedYear) {
      localStorage.setItem('timelineSelectedYear', selectedYear.toString());
      localStorage.setItem('timelineSelectedItemIndex', selectedItemIndex.toString());
    }
  }, [selectedYear, selectedItemIndex]);

  // Fetch timeline data from the API
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setIsLoading(true);
        const response = await getTimelines();

        if (response && response.data && response.data.length > 0) {
          // Process and format the timeline data
          const processedData = response.data.map((item, idx) => ({
            id: item._id || `timeline-${idx}`,
            year: new Date(item.date).getFullYear(),
            date: new Date(item.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            title: item.title,
            hindi_title: item.hindi_title || '',
            description: item.description,
            hindi_description: item.hindi_description || '',
            category: item.category || 'uncategorized',
            impact: item.impact || '',
            hindi_impact: item.hindi_impact || '',
            achievement: item.achievement || '',
            // Map gallery items to just their file paths for the images array
            images: item.gallery && item.gallery.length > 0 ? item.gallery.map(img => img.filePath) : [],
            isKeyMilestone: item.isKeyMilestone || false,
            testimonial: item.testimonial || null
          }));

          // Sort by year in ascending order
          const sortedData = processedData.sort((a, b) => a.year - b.year);
          setTimelineData(sortedData);

          // Extract and set unique categories
          const uniqueCategories = ['all'];
          const categoryIcons = {
            all: 'Grid3X3',
            achievements: 'Trophy',
            programs: 'BookOpen',
            partnerships: 'Handshake',
            'policy changes': 'FileText',
            'upcoming projects': 'Rocket',
            uncategorized: 'Tag'
          };

          sortedData.forEach(item => {
            if (item.category && !uniqueCategories.includes(item.category)) {
              uniqueCategories.push(item.category);
            }
          });

          const formattedCategories = uniqueCategories.map(category => ({
            value: category,
            label: category === 'all' ? getTranslation('allCategories') :
              category.charAt(0).toUpperCase() + category.slice(1),
            icon: categoryIcons[category] || 'Tag'
          }));

          setCategories(formattedCategories);

          // Generate decades based on the years in the data
          const years = sortedData.map(item => item.year);
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          const minDecade = Math.floor(minYear / 10) * 10;
          const maxDecade = Math.floor(maxYear / 10) * 10;

          const decadesList = [];
          for (let decade = minDecade; decade <= maxDecade; decade += 10) {
            const decadeYears = years.filter(year =>
              year >= decade && year < decade + 10
            );

            if (decadeYears.length > 0) {
              decadesList.push({
                value: `${decade}s`,
                label: `${decade}-${decade + 9}`,
                years: decadeYears
              });
            }
          }

          setDecades(decadesList);

          // Try to restore previously selected timeline position
          const savedYear = localStorage.getItem('timelineSelectedYear');
          const savedIndex = localStorage.getItem('timelineSelectedItemIndex');
          
          if (savedYear && years.includes(parseInt(savedYear))) {
            setSelectedYear(parseInt(savedYear));
            
            if (savedIndex) {
              const maxIndex = sortedData.filter(item => item.year === parseInt(savedYear)).length - 1;
              const parsedIndex = parseInt(savedIndex);
              setSelectedItemIndex(parsedIndex > maxIndex ? 0 : parsedIndex);
            }
          } else if (sortedData.length > 0) {
            // If no saved position or invalid year, set initial selections
            setSelectedYear(sortedData[0].year);
          }

        } else {
          setTimelineData([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching timeline data:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, []);  // Remove getTranslation dependency

  const filteredData = timelineData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesAchievement = selectedAchievement === 'all' || item.achievement === selectedAchievement;
    const matchesDecade = !selectedDecade ||
      decades.find(d => d.value === selectedDecade)?.years.includes(item.year);
    return matchesCategory && matchesAchievement && matchesDecade;
  });

  // Group timeline items by year
  const groupedByYear = filteredData.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {});

  // Create an array of unique years
  const uniqueYears = Object.keys(groupedByYear).map(Number).sort((a, b) => a - b);

  const handleYearSelect = (year) => {
    setIsLoading(true);
    setTimeout(() => {
      const items = groupedByYear[year] || [];

      if (selectedYear === year) {
        if (items.length > 1) {
          // Toggle to next item in the list
          const nextIndex = (selectedItemIndex + 1) % items.length;
          setSelectedItemIndex(nextIndex);
        }
        // If only one item, do nothing (keep showing it)
        // Don't reset selectedYear or index
      } else {
        // New year selected
        setSelectedYear(year);
        setSelectedItemIndex(0);
      }

      setIsLoading(false);
    }, 300);
  };

  const handleDecadeJump = (decade) => {
    setSelectedDecade(decade);
    if (!decade) {
      // If decade is cleared, reset selection
      if (timelineData.length > 0) {
        const firstYear = timelineData[0].year;
        setSelectedYear(firstYear);
      }
      return;
    }

    const decadeYears = decades.find(d => d.value === decade)?.years || [];
    if (decadeYears.length > 0) {
      const firstYear = decadeYears[0];
      setSelectedYear(firstYear);
      setSelectedItemIndex(0);

      // Find the node in the horizontal timeline
      setTimeout(() => {
        const node = document.getElementById(`year-${firstYear}`);
        if (node && timelineRef.current) {
          // Calculate scroll position to center the node
          const nodeRect = node.getBoundingClientRect();
          const containerRect = timelineRef.current.getBoundingClientRect();
          const scrollLeft = nodeRect.left - containerRect.left - (containerRect.width / 2) + (nodeRect.width / 2);

          timelineRef.current.scrollTo({
            left: timelineRef.current.scrollLeft + scrollLeft,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const navigateTimeline = (direction) => {
    // Find the index of the current year in uniqueYears
    const currentYearIndex = uniqueYears.findIndex(year => year === selectedYear);
    if (currentYearIndex === -1) return;

    // Get the current items for the selected year
    const itemsInCurrentYear = groupedByYear[selectedYear] || [];

    if (direction === 'left') {
      // If we have multiple items in the current year and not at the first item
      if (itemsInCurrentYear.length > 1 && selectedItemIndex > 0) {
        // Navigate to previous item in the same year
        setSelectedItemIndex(selectedItemIndex - 1);
      } else {
        // Move to previous year
        const newYearIndex = Math.max(0, currentYearIndex - 1);
        if (newYearIndex !== currentYearIndex) {
          const newYear = uniqueYears[newYearIndex];
          setSelectedYear(newYear);
          // Set to the last item of the previous year
          setSelectedItemIndex(groupedByYear[newYear].length - 1);

          // Scroll to the selected year in the timeline
          const node = document.getElementById(`year-${newYear}`);
          if (node && timelineRef.current) {
            node.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        }
      }
    } else {
      // Going right
      // If we have multiple items in the current year and not at the last item
      if (itemsInCurrentYear.length > 1 && selectedItemIndex < itemsInCurrentYear.length - 1) {
        // Navigate to next item in the same year
        setSelectedItemIndex(selectedItemIndex + 1);
      } else {
        // Move to next year
        const newYearIndex = Math.min(uniqueYears.length - 1, currentYearIndex + 1);
        if (newYearIndex !== currentYearIndex) {
          const newYear = uniqueYears[newYearIndex];
          setSelectedYear(newYear);
          // Set to the first item of the next year
          setSelectedItemIndex(0);

          // Scroll to the selected year in the timeline
          const node = document.getElementById(`year-${newYear}`);
          if (node && timelineRef.current) {
            node.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        }
      }
    }
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      timelineRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCurrentProgress = () => {
    if (!selectedYear || timelineData.length === 0) return 0;
    const currentIndex = timelineData.findIndex(item => item.year === selectedYear);
    return ((currentIndex + 1) / timelineData.length) * 100;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        navigateTimeline(event.key === 'ArrowLeft' ? 'left' : 'right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedYear, selectedItemIndex, filteredData]);

  // Reset selected item index when filters change
  useEffect(() => {
    setSelectedItemIndex(0);
  }, [selectedCategory, selectedAchievement, selectedDecade]);

  if (isLoading && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size={40} message={getTranslation('loadingTimeline')} />
          </div>
        </div>
      </div>
    );
  }

  if (error && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">{getTranslation('errorLoadingTimeline')}</h2>
            <p className="text-text-secondary">
              {getTranslation('timelineErrorMessage')}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              {getTranslation('retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no data is available, show a message
  if (timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-primary mb-4">{getTranslation('noTimelineData')}</h2>
            <p className="text-text-secondary">
              {getTranslation('noTimelineDataMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            {getPageText('pageTitle')}
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto font-body">
            {getPageText('pageDescription')}
          </p>
        </motion.div>

        {/* Filter Controls */}
        <FilterControls
          categories={categories}
          selectedCategory={selectedCategory}
          selectedAchievement={selectedAchievement}
          onCategoryChange={setSelectedCategory}
          decades={decades}
          selectedDecade={selectedDecade}
          onAchievementChange={setSelectedAchievement}
          onDecadeJump={handleDecadeJump}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categoryLabel={getTranslation('filterByCategory')}
          decadeLabel={getTranslation('filterByDecade')}
          allDecadesText={getTranslation('allDecades')}
        />

        {/* Progress Bar */}
        <ProgressIndicator
          progress={getCurrentProgress()}
          totalMilestones={timelineData.length}
          currentIndex={timelineData.findIndex(item => item.year === selectedYear) + 1}
        />

        {/* Timeline View - Horizontal */}
        {viewMode === 'timeline' && (
          <div className="py-12 relative">
            {/* Navigation buttons - Timeline scroll */}
            <div className="absolute left-0 top-1/3 transform -translate-y-1/2 z-10">
              <button
                onClick={() => scrollTimeline('left')}
                className="bg-surface p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                aria-label={getTranslation('navigateLeft')}
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
            </div>
            <div className="absolute right-0 top-1/3 transform -translate-y-1/2 z-10">
              <button
                onClick={() => scrollTimeline('right')}
                className="bg-surface p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                aria-label={getTranslation('navigateRight')}
              >
                <Icon name="ChevronRight" size={24} />
              </button>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative mx-12 overflow-hidden">
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-[40px] h-1 bg-accent"></div>

              {/* Timeline Nodes */}
              <div
                ref={timelineRef}
                className="flex space-x-16 px-8 overflow-x-auto scrollbar-hide py-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {uniqueYears.map((year, index) => (
                  <div
                    key={`timeline-${year}`}
                    id={`year-${year}`}
                    className="flex-shrink-0"
                  >
                    <div className="flex flex-col items-center">
                      <TimelineNode
                        year={year}
                        isSelected={selectedYear === year}
                        isKeyMilestone={groupedByYear[year].some(item => item.isKeyMilestone)}
                        onClick={() => handleYearSelect(year)}
                        index={index}
                        count={groupedByYear[year].length}
                        currentIndex={selectedYear === year ? selectedItemIndex + 1 : null}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Milestone Card */}
            <AnimatePresence>
              {selectedYear && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-12 max-w-4xl mx-auto relative"
                >
                  {/* Milestone Navigation Controls */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-5 z-20">
                    <button
                      onClick={() => navigateTimeline('left')}
                      className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                      aria-label={getTranslation('navigateLeft')}
                      disabled={filteredData.findIndex(item => item.year === selectedYear) === 0}
                    >
                      <Icon
                        name="ArrowLeft"
                        size={20}
                        className={filteredData.findIndex(item => item.year === selectedYear) === 0 ? "opacity-50" : ""}
                      />
                    </button>
                  </div>

                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-5 z-20">
                    <button
                      onClick={() => navigateTimeline('right')}
                      className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                      aria-label={getTranslation('navigateRight')}
                      disabled={filteredData.findIndex(item => item.year === selectedYear) === filteredData.length - 1}
                    >
                      <Icon
                        name="ArrowRight"
                        size={20}
                        className={filteredData.findIndex(item => item.year === selectedYear) === filteredData.length - 1 ? "opacity-50" : ""}
                      />
                    </button>
                  </div>

                  {(() => {
                    if (!selectedYear) return null;

                    const itemsForYear = groupedByYear[selectedYear] || [];
                    if (itemsForYear.length === 0) return null;

                    // Get the current selected item for the year
                    const selectedItem = itemsForYear[selectedItemIndex];
                    if (!selectedItem) return null;

                    return (
                      <MilestoneCard
                        title={selectedItem.title}
                        date={selectedItem.date}
                        description={selectedItem.description}
                        category={selectedItem.category}
                        impact={selectedItem.impact}
                        images={selectedItem.images}
                        testimonial={selectedItem.testimonial}
                        isKeyMilestone={selectedItem.isKeyMilestone}
                        position="center"
                        itemCount={itemsForYear.length}
                        currentIndex={selectedItemIndex + 1}
                        item={selectedItem}
                        onPrevious={() => navigateTimeline('left')}
                        onNext={() => navigateTimeline('right')}
                      />
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Decade View */}
        {viewMode === 'decade' && (
          <div className="py-12">
            {decades.length === 0 ? (
              <div className="text-center py-12">
                <p>{getPageText('noTimelineData')}</p>
              </div>
            ) : (
              decades.map((decade) => (
                <div key={decade.value} className="mb-16">
                  <h2 className="text-3xl font-heading font-bold text-primary mb-6 text-center">
                    {decade.label}
                  </h2>
                  
                  {/* Decade description or summary could go here */}
                  
                  {/* Timeline items for this decade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData
                      .filter(item => item.year >= parseInt(decade.label) && item.year <= parseInt(decade.label) + 9)
                      .map((item) => (
                        <MilestoneCard
                          key={item.id}
                          title={item.title}
                          hindi_title={item.hindi_title}
                          date={item.date}
                          description={item.description}
                          hindi_description={item.hindi_description}
                          category={item.category}
                          impact={item.impact}
                          hindi_impact={item.hindi_impact}
                          images={item.images}
                          isKeyMilestone={item.isKeyMilestone}
                          compact={true}
                          onClick={() => setSelectedItem(item)}
                        />
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CSS for hiding scrollbars */}
        <style jsx>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm bg-black/80 px-6 pb-6 pt-20 md:pt-26 lg:pt-30">
          <div className="bg-white border-4 border-green-600 rounded-2xl shadow-2xl max-w-4xl w-full relative overflow-hidden max-h-[80vh] mt-16 md:mt-8 lg:mt-0 overflow-y-auto">

            {/* Close Button */}
            <button
              className="absolute top-5 right-5 z-10 text-gray-600 hover:text-red-500 bg-white bg-opacity-80 p-2.5 rounded-full shadow-lg transition-colors duration-300"
              onClick={() => setSelectedItem(null)}
            >
              <Icon name="X" size={22} />
            </button>

            {/* Top Image if available */}
            {selectedItem.images && selectedItem.images.length > 0 ? (
              <div className="relative w-full h-72 md:h-80 overflow-hidden">
                <img
                  src={selectedItem.images[0]}
                  alt="Main Visual"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ) : (
              /* Decorative header when no image is available */
              <div className="bg-gradient-to-r from-green-600 to-green-700 h-24"></div>
            )}

            {/* Date and Milestone Badge - Always Outside the Image */}
            <div className="bg-gray-50 px-8 md:px-10 py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedItem.date}
                </span>
                {selectedItem.isKeyMilestone && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Icon name="Star" size={14} />
                    <span>{getTranslation('keyMilestone')}</span>
                  </span>
                )}
                {selectedItem.category && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Icon name="Tag" size={14} />
                    <span>{selectedItem.category}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 space-y-7">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-green-700 leading-tight -mt-2">
                {selectedItem.title}
              </h2>

              {/* Description */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="leading-relaxed whitespace-pre-line">{selectedItem.description}</p>
              </div>

              {selectedItem.achievement && (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <Icon name="Award" size={22} />
                    <span>{getTranslation('achievement')}</span>
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{translateAchievement(selectedItem.achievement, language)}</p>
                </div>
              )}

              {selectedItem.impact && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                    <Icon name="TrendingUp" size={22} />
                    <span>{getTranslation('impact')}</span>
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{selectedItem.impact}</p>
                </div>
              )}

              {/* Gallery Images (excluding first one if already shown above) */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="space-y-5 pt-2">
                  <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-4">
                    <Icon name="Image" size={22} />
                    <span>{getTranslation('gallery')}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {selectedItem.images.slice(1).map((img, idx) => (
                      <div key={idx} className="overflow-hidden rounded-lg shadow-md border border-gray-100 bg-gray-50">
                        <img
                          src={img}
                          alt={`Gallery image ${idx + 2}`}
                          className="rounded-lg object-contain w-full h-48 md:h-56 hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom action buttons */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                >
                  <span>{getTranslation('close')}</span>
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AndolanTimelinePage;