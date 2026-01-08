import { en } from './translations/en';
import { ar } from './translations/ar';

const translations = {
  en,
  ar
};

// Get nested translation by path (e.g., "nav.dashboard")
export const getTranslation = (lang, path) => {
  const keys = path.split('.');
  let value = translations[lang];
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  return value || path;
};

// Hook for using translations in components
export const useTranslation = (language) => {
  const t = (path, params = {}) => {
    let translation = getTranslation(language, path);
    
    // Replace parameters in translation (e.g., {count}, {amount})
    if (typeof translation === 'string' && params) {
      Object.keys(params).forEach(key => {
        translation = translation.replace(new RegExp(`{${key}}`, 'g'), params[key]);
      });
    }
    
    return translation;
  };
  
  return { t };
};

export { translations };
