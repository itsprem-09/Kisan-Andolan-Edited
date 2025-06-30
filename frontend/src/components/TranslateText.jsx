import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Component to handle both static and dynamic text translations
 * @param {Object} props - Component props
 * @param {string} props.children - Text content to be translated (English content)
 * @param {string} props.hindiText - Hindi content to display when language is Hindi
 * @param {string} props.className - Optional additional CSS classes
 * @param {string} props.translationKey - Optional translation key for static translations
 * @param {boolean} props.dynamic - Whether to use dynamic translation (default: true when no translationKey is provided)
 */
const TranslateText = ({ children, hindiText, className = '', translationKey, dynamic = true, ...rest }) => {
  const { language, getTranslation } = useLanguage();
  const textRef = useRef(null);
  
  // Mark this element for dynamic translation if needed
  useEffect(() => {
    // If we have a translationKey or hindiText, we don't need dynamic translation
    if (!translationKey && !hindiText && dynamic && textRef.current) {
      textRef.current.setAttribute('data-translate', 'true');
    }
  }, [translationKey, hindiText, dynamic]);
  
  // If we have a translationKey, use static translation
  if (translationKey) {
    return (
      <span 
        className={className}
        {...rest}
      >
        {getTranslation(translationKey)}
      </span>
    );
  }
  
  // If we have direct Hindi text and language is Hindi, display Hindi text
  if (hindiText && language === 'hi') {
    return (
      <span 
        className={className}
        {...rest}
      >
        {hindiText}
      </span>
    );
  }
  
  // Otherwise use dynamic translation or display original English content
  return (
    <span 
      ref={textRef}
      className={className}
      {...rest}
    >
      {children}
    </span>
  );
};

export default TranslateText; 