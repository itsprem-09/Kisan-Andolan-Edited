import React from 'react';
import Icon from './AppIcon';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="bg-surface border border-border rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-smooth flex items-center space-x-2 focus:outline-none"
        >
            <span className="text-sm font-medium flex gap-2 p-1 items-center">
               <Icon name="Globe" size={16} /> {language === 'en' ? 'हिंदी' : 'English'}
            </span>
        </button>
    );
};

export default LanguageToggle;
