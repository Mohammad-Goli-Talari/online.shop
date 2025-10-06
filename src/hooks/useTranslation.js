import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace = 'translation') => {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  // Enhanced translation function with fallback
  const translate = (key, options = {}) => {
    try {
      return t(key, options);
    } catch {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return the key as fallback
    }
  };

  // Get current language info
  const getCurrentLanguage = () => {
    return {
      code: i18n.language,
      name: t(`languages.${i18n.language}`, { defaultValue: i18n.language }),
      direction: i18n.language === 'ar' || i18n.language === 'fa' ? 'rtl' : 'ltr',
      isRTL: i18n.language === 'ar' || i18n.language === 'fa'
    };
  };

  // Format currency based on locale
  const formatCurrency = (amount, currency = 'USD') => {
    const localeMap = {
      en: 'en-US',
      fa: 'fa-IR',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };

    const currencyMap = {
      en: 'USD',
      fa: 'IRR',
      ar: 'SAR',
      zh: 'CNY'
    };

    const locale = localeMap[i18n.language] || 'en-US';
    const currencyCode = currencyMap[i18n.language] || currency;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(amount);
    } catch {
      return `${currencyCode} ${amount}`;
    }
  };

  // Format date based on locale
  const formatDate = (date, options = {}) => {
    const localeMap = {
      en: 'en-US',
      fa: 'fa-IR',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };

    const locale = localeMap[i18n.language] || 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };

    try {
      return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  // Format number based on locale
  const formatNumber = (number, options = {}) => {
    const localeMap = {
      en: 'en-US',
      fa: 'fa-IR',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };

    const locale = localeMap[i18n.language] || 'en-US';

    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch {
      return number.toString();
    }
  };

  return {
    t: translate,
    i18n,
    ready,
    getCurrentLanguage,
    formatCurrency,
    formatDate,
    formatNumber,
    // Convenience methods
    isRTL: getCurrentLanguage().isRTL,
    direction: getCurrentLanguage().direction,
    language: i18n.language
  };
};
