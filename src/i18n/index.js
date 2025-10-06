import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import faTranslations from './locales/fa.json';
import arTranslations from './locales/ar.json';
import zhTranslations from './locales/zh.json';

const resources = {
  en: {
    translation: enTranslations
  },
  fa: {
    translation: faTranslations
  },
  ar: {
    translation: arTranslations
  },
  zh: {
    translation: zhTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
