import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import MUI locales
import { enUS, faIR, arSA, zhCN } from '@mui/material/locale';

// Import date-fns locales
import { enUS as enUSDate } from 'date-fns/locale/en-US';
import { faIR as faIRDate } from 'date-fns/locale/fa-IR';
import { arSA as arSADate } from 'date-fns/locale/ar-SA';
import { zhCN as zhCNDate } from 'date-fns/locale/zh-CN';

import { LanguageContext } from '../contexts/LanguageContext.js';

const localeMap = {
  en: { mui: enUS || {}, date: enUSDate || {}, dir: 'ltr' },
  fa: { mui: faIR || {}, date: faIRDate || {}, dir: 'rtl' },
  ar: { mui: arSA || {}, date: arSADate || {}, dir: 'rtl' },
  zh: { mui: zhCN || {}, date: zhCNDate || {}, dir: 'ltr' }
};

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    const lang = savedLanguage.split('-')[0]; // Handle cases like 'en-US'
    setCurrentLanguage(lang);
    setDirection(localeMap[lang]?.dir || 'ltr');
    
    // Update document direction
    document.dir = localeMap[lang]?.dir || 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setDirection(localeMap[lang]?.dir || 'ltr');
    
    // Update document direction and language
    document.dir = localeMap[lang]?.dir || 'ltr';
    document.documentElement.lang = lang;
    
    // Change i18n language
    i18n.changeLanguage(lang);
    
    // Save to localStorage
    localStorage.setItem('i18nextLng', lang);
  };

  const getCurrentLocale = () => {
    try {
      return localeMap[currentLanguage] || localeMap.en;
    } catch (error) {
      console.warn('Error getting locale, falling back to English:', error);
      return localeMap.en;
    }
  };

  const value = {
    currentLanguage,
    direction,
    changeLanguage,
    getCurrentLocale,
    isRTL: direction === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
