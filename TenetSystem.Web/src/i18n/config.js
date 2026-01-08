// i18n configuration
export const languages = {
  en: 'English',
  ar: 'العربية'
};

export const defaultLanguage = 'en';

// Get current language from localStorage or default
export const getCurrentLanguage = () => {
  return localStorage.getItem('language') || defaultLanguage;
};

// Set language in localStorage
export const setLanguage = (lang) => {
  localStorage.setItem('language', lang);
};
