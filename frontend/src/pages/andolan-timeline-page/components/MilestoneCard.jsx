import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { useLanguage } from 'contexts/LanguageContext';
import TranslateText from 'components/TranslateText';

const MilestoneCard = ({ 
  title, 
  hindi_title,
  date, 
  description, 
  hindi_description,
  category, 
  impact, 
  hindi_impact,
  images = [],
  testimonial, 
  isKeyMilestone,
  position,
  itemCount = 1,
  currentIndex = 1,
  item,
  onPrevious,
  onNext,
  compact,
  onClick
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { getTranslation, language } = useLanguage();

  const finalTitle = item?.title || title;
  const finalHindiTitle = item?.hindi_title || hindi_title;
  const finalDate = item?.date || date;
  const finalDescription = item?.description || description;
  const finalHindiDescription = item?.hindi_description || hindi_description;
  const finalCategory = item?.category || category;
  const finalImpact = item?.impact || impact;
  const finalHindiImpact = item?.hindi_impact || hindi_impact;
  const finalImages = item?.images || images;
  const finalTestimonial = item?.testimonial || testimonial;
  const finalIsKeyMilestone = item?.isKeyMilestone || isKeyMilestone;

  // Display Hindi content when language is set to Hindi
  const displayTitle = language === 'hi' && finalHindiTitle ? finalHindiTitle : finalTitle;
  const displayDescription = language === 'hi' && finalHindiDescription ? finalHindiDescription : finalDescription;
  const displayImpact = language === 'hi' && finalHindiImpact ? finalHindiImpact : finalImpact;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === finalImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? finalImages.length - 1 : prev - 1
    );
  };

  const getCategoryIcon = (categoryValue) => {
    const iconMap = {
      'achievements': 'Trophy',
      'programs': 'BookOpen',
      'partnerships': 'Handshake',
      'policy changes': 'FileText',
      'upcoming projects': 'Rocket'
    };
    return iconMap[categoryValue] || 'Calendar';
  };

  const getCategoryColor = (categoryValue) => {
    const colorMap = {
      'achievements': 'text-success',
      'programs': 'text-primary',
      'partnerships': 'text-secondary',
      'policy changes': 'text-warning',
      'upcoming projects': 'text-error'
    };
    return colorMap[categoryValue] || 'text-primary';
  };

  const hasMultiple = itemCount > 1;

  if (compact) {
    return (
      <div 
        className="bg-surface rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer hover:bg-gray-50"
        onClick={onClick}
      >
        <div className="mb-4">
          <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {finalDate}
          </span>
          {finalIsKeyMilestone && (
            <span className="inline-flex items-center ml-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
              <Icon name="Star" size={12} className="mr-1" />
              {getTranslation('keyMilestone')}
            </span>
          )}
        </div>
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
          {displayTitle}
        </h3>
        <p className="text-text-secondary line-clamp-3 mb-4">
          {displayDescription}
        </p>
        <div className="flex justify-between items-center">
          {finalCategory && (
            <span className="text-sm text-text-secondary flex items-center">
              <Icon name={getCategoryIcon(finalCategory)} size={14} className="mr-1" />
              {finalCategory}
            </span>
          )}
          <div className="text-primary hover:text-primary-dark">
            <span className="text-sm flex items-center">
              <span className="mr-1">{getTranslation('readMore')}</span>
              <Icon name="ArrowRight" size={14} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-surface rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg bg-background ${getCategoryColor(finalCategory)}`}>
              <Icon name={getCategoryIcon(finalCategory)} size={20} />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-heading font-bold text-text-primary">
                {displayTitle}
              </h3>
              <p className="text-sm text-text-secondary font-caption">
                {finalDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {finalIsKeyMilestone && (
              <div className="inline-flex items-center space-x-2 bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                <Icon name="Star" size={14} />
                <span>{getTranslation('keyMilestone')}</span>
              </div>
            )}
            
            {hasMultiple && (
              <div className="inline-flex items-center space-x-2 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Icon name="Calendar" size={14} />
                <span>{getTranslation('eventCount', { current: currentIndex, total: itemCount })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Description and Impact */}
        <div className="lg:col-span-3">
          {/* Description */}
          <div className="mb-6">
            <p className="text-text-primary font-body leading-relaxed whitespace-pre-line">
              {displayDescription}
            </p>
          </div>
          
          {/* Impact */}
          {finalImpact && (
            <div className="mb-6 p-4 bg-background rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={18} className="text-success" />
                <h4 className="font-heading font-semibold text-text-primary">{getTranslation('impact')}</h4>
              </div>
              <p className="text-success font-medium">{displayImpact}</p>
            </div>
          )}
          
          {/* Testimonial - Only shown on small screens */}
          {finalTestimonial && (
            <div className="lg:hidden border-l-4 border-primary pl-4 py-2 bg-primary bg-opacity-5 rounded-r-lg mb-6">
              <blockquote className="text-text-primary font-body italic mb-2">
                "{finalTestimonial.quote}"
              </blockquote>
              <cite className="text-text-secondary font-caption font-medium">
                — {finalTestimonial.author}
              </cite>
            </div>
          )}
        </div>
        
        {/* Right Column: Images and Testimonial */}
        <div className="lg:col-span-2">
          {/* Images Gallery Grid */}
          {finalImages?.length > 0 && (
            <div className="mb-6">
              {/* Gallery Title */}
              <h4 className="font-heading font-semibold text-text-primary mb-3 flex items-center">
                <Icon name="Camera" size={16} className="mr-2" />
                {getTranslation('gallery')} ({finalImages.length} {finalImages.length === 1 ? getTranslation('image') : getTranslation('images')})
              </h4>

              {/* Gallery Grid */}
              <div className={`grid gap-2 ${finalImages.length === 1 ? 'grid-cols-1' : finalImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {finalImages.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer
                      ${finalImages.length === 1 ? 'h-64' : 'h-40 md:h-48'}
                      ${finalImages.length > 4 && index >= 4 ? 'hidden md:block' : ''}
                      hover:opacity-95 transition-opacity`}
                  >
                    <Image
                      src={image}
                      alt={`${displayTitle} - Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Expand button overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-black/60 text-white p-2 rounded-full">
                        <Icon name="Maximize" size={16} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show more button if there are more than 4 images on mobile */}
                {finalImages.length > 4 && (
                  <div className="md:hidden relative h-40 rounded-lg overflow-hidden cursor-pointer bg-primary/10"
                    onClick={() => handleImageClick(4)}>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      <div className="text-center">
                        <Icon name="Plus" size={24} className="mx-auto mb-1" />
                        <p className="text-sm font-medium">+{finalImages.length - 4} {getTranslation('more')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View all images button if there are many */}
              {finalImages.length > 6 && (
                <button
                  onClick={() => handleImageClick(0)}
                  className="w-full mt-2 py-2 text-sm text-center text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors flex items-center justify-center"
                >
                  <Icon name="Images" size={16} className="mr-1" />
                  {getTranslation('viewAllImages', { count: finalImages.length })}
                </button>
              )}
            </div>
          )}
          
          {/* Testimonial - Only shown on larger screens */}
          {finalTestimonial && (
            <div className="hidden lg:block border-l-4 border-primary pl-4 py-2 bg-primary bg-opacity-5 rounded-r-lg">
              <blockquote className="text-text-primary font-body italic mb-2">
                "{finalTestimonial.quote}"
              </blockquote>
              <cite className="text-text-secondary font-caption font-medium">
                — {finalTestimonial.author}
              </cite>
            </div>
          )}
        </div>
      </div>
      
      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={finalImages[selectedImageIndex]}
                alt={`${displayTitle} - Full size`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />

              {/* Navigation */}
              {finalImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                  >
                    <Icon name="ChevronLeft" size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                  >
                    <Icon name="ChevronRight" size={24} />
                  </button>
                </>
              )}

              {/* Close */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
              >
                <Icon name="X" size={24} />
              </button>

              {/* Counter */}
              {finalImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {finalImages.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MilestoneCard;