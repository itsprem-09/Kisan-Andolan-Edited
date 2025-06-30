import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useLanguage } from 'contexts/LanguageContext';
import TranslateText from 'components/TranslateText';

const FilterControls = ({
  categories,
  decades,
  selectedAchievement,
  selectedCategory,
  selectedDecade,
  viewMode,
  onAchievementChange,
  onCategoryChange,
  onDecadeJump,
  onViewModeChange,
  // For backward compatibility with the new implementation
  categoryLabel,
  decadeLabel,
  allDecadesText,
  onDecadeChange
}) => {
  const { getTranslation, language } = useLanguage();
  
  // Use the callback handlers that were provided
  const handleCategoryChange = onCategoryChange;
  const handleAchievementChange = onAchievementChange;
  const handleDecadeJump = onDecadeJump || onDecadeChange;

  // Define achievements array with Hindi translations
  const achievements = [
    { id: 'all', en: 'All Achievements', hi: 'सभी उपलब्धियां' },
    { id: 'Debt Relief Assistance', en: 'Debt Relief Assistance', hi: 'कर्ज राहत सहायता' },
    { id: 'Organic Farming Training', en: 'Organic Farming Training', hi: 'जैविक खेती प्रशिक्षण' },
    { id: 'Access to Agricultural Equipment', en: 'Access to Agricultural Equipment', hi: 'कृषि उपकरणों तक पहुंच' },
    { id: 'Farmer Market Linkage Programs', en: 'Farmer Market Linkage Programs', hi: 'किसान बाजार लिंकेज कार्यक्रम' },
    { id: 'Crop Insurance Enrollment Drive', en: 'Crop Insurance Enrollment Drive', hi: 'फसल बीमा नामांकन अभियान' },
    { id: "Children's Education Support", en: "Children's Education Support", hi: 'बच्चों की शिक्षा सहायता' },
    { id: 'Water Conservation & Irrigation Projects', en: 'Water Conservation & Irrigation Projects', hi: 'जल संरक्षण और सिंचाई परियोजनाएं' },
    { id: 'Rural Health Camps & Mental Health Support', en: 'Rural Health Camps & Mental Health Support', hi: 'ग्रामीण स्वास्थ्य शिविर और मानसिक स्वास्थ्य सहायता' }
  ];

  // Function to clear all filters
  const clearAllFilters = () => {
    handleCategoryChange('all');
    handleAchievementChange('all');
    handleDecadeJump(null);
  };

  // Function to get displayed text based on language
  const getLocalizedText = (enText, hiText) => {
    return language === 'hi' ? hiText : enText;
  };

  return (
    <motion.div
      className="mb-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-surface border border-border rounded-lg p-1 inline-flex">
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 touch-target ${viewMode === 'timeline' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            <Icon name="Timeline" size={16} className="inline mr-2" />
            <TranslateText hindiText="समयरेखा दृश्य">{getTranslation('timelineView')}</TranslateText>
          </button>
          <button
            onClick={() => onViewModeChange('decade')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 touch-target ${viewMode === 'decade' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            <Icon name="Calendar" size={16} className="inline mr-2" />
            <TranslateText hindiText="दशक दृश्य">{getTranslation('decadeView')}</TranslateText>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          <TranslateText hindiText="श्रेणी द्वारा फ़िल्टर करें">
            {categoryLabel || getTranslation('filterByCategory')}
          </TranslateText>
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${selectedCategory === category.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name={category.icon} size={16} />
              <span>
                <TranslateText>
                  {category.label}
                </TranslateText>
              </span>
              {selectedCategory === category.value && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievement Filters */}
      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          <TranslateText hindiText="उपलब्धि द्वारा फ़िल्टर करें">
            {getTranslation('filterByAchievement')}
          </TranslateText>
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {achievements.map((achievement, i) => (
            <motion.button
              key={i}
              onClick={() => handleAchievementChange(achievement.id)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${selectedAchievement === achievement.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {language === 'hi' ? achievement.hi : achievement.en}
              </span>
              {selectedAchievement === achievement.id && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decade Quick Jump */}
      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          <TranslateText hindiText="दशक पर जाएं">
            {decadeLabel || getTranslation('jumpToDecade')}
          </TranslateText>
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            key="all-decades"
            onClick={() => handleDecadeJump(null)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${!selectedDecade
              ? 'bg-secondary text-white shadow-md'
              : 'bg-surface border border-border text-text-secondary hover:border-secondary hover:text-secondary'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-base font-bold">
              <TranslateText hindiText="सभी दशक">
                {allDecadesText || getTranslation('allDecades')}
              </TranslateText>
            </div>
          </motion.button>
          
          {decades.map((decade) => (
            <motion.button
              key={decade.value}
              onClick={() => handleDecadeJump(decade.value)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${selectedDecade === decade.value
                ? 'bg-secondary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-secondary hover:text-secondary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-base font-bold">{decade.label}</div>
              <div className="text-xs opacity-80">
                {decade.years.length} <TranslateText hindiText={decade.years.length !== 1 ? 'मील के पत्थर' : 'मील का पत्थर'}>
                  {getTranslation(decade.years.length !== 1 ? 'milestones' : 'milestone')}
                </TranslateText>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedDecade || selectedAchievement !== 'all') && (
        <motion.div
          className="flex flex-wrap justify-center items-center gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm text-text-secondary font-caption">
            <TranslateText hindiText="सक्रिय फ़िल्टर:">
              {getTranslation('activeFilters')}:
            </TranslateText>
          </span>

          {selectedCategory !== 'all' && (
            <div className="inline-flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {selectedDecade && (
            <div className="inline-flex items-center space-x-1 bg-secondary text-white px-3 py-1 rounded-full text-sm">
              <span>{decades.find(d => d.value === selectedDecade)?.label}</span>
              <button
                onClick={() => handleDecadeJump(null)}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {selectedAchievement !== 'all' && (
            <div className="inline-flex items-center space-x-1 bg-warning text-white px-3 py-1 rounded-full text-sm">
              <span>
                {language === 'hi' 
                  ? achievements.find(a => a.id === selectedAchievement)?.hi 
                  : selectedAchievement}
              </span>
              <button
                onClick={() => handleAchievementChange('all')}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          <button
            onClick={clearAllFilters}
            className="px-3 py-1 bg-surface border border-border text-text-primary rounded-full text-sm hover:bg-background transition-colors ml-2"
          >
            <Icon name="FilterX" size={14} className="inline mr-1" />
            <TranslateText hindiText="सभी साफ़ करें">{getTranslation('clearAll')}</TranslateText>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterControls;