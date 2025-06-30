import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const ProgressIndicator = ({ progress, currentYear, totalMilestones }) => {
  return (
    <motion.div 
      className="mb-8 bg-surface border border-border rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={20} className="text-primary" />
          <div>
            <h3 className="text-sm font-heading font-semibold text-text-primary">
              Timeline Progress
            </h3>
            {currentYear && (
              <p className="text-xs text-text-secondary font-caption">
                Currently viewing: {currentYear}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-heading font-bold text-primary">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-text-secondary font-caption">
            {totalMilestones} milestones
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-accent rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
        
        {/* Progress markers */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {[0, 25, 50, 75, 100].map((marker) => (
            <div
              key={marker}
              className={`w-1 h-2 rounded-full ${
                progress >= marker ? 'bg-primary' : 'bg-accent'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Milestone indicators */}
      <div className="flex justify-between mt-2 text-xs text-text-secondary font-caption">
        <span>2003</span>
        <span>2010</span>
        <span>2015</span>
        <span>2020</span>
        <span>2024</span>
      </div>
      
      {/* Navigation hint */}
      {!currentYear && (
        <motion.div 
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-xs text-text-secondary font-caption flex items-center justify-center space-x-2">
            <Icon name="MousePointer" size={14} />
            <span>Click on any year to explore that milestone</span>
          </p>
        </motion.div>
      )}
      
      {/* Keyboard navigation hint */}
      {currentYear && (
        <motion.div 
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xs text-text-secondary font-caption flex items-center justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <Icon name="ArrowLeft" size={12} />
              <span>Previous</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="ArrowRight" size={12} />
              <span>Next</span>
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressIndicator;