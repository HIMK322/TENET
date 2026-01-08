import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button className="language-switcher" onClick={toggleLanguage}>
      {language === 'en' ? 'ع' : 'En'}
    </button>
  );
}

export default LanguageSwitcher;
