import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage as saveLanguage } from '../i18n/config';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getCurrentLanguage());

  const setLanguage = (lang) => {
    setLanguageState(lang);
    saveLanguage(lang);
    
    document.documentElement.setAttribute('lang', lang);
  };

  useEffect(() => {
    // Set initial direction
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
