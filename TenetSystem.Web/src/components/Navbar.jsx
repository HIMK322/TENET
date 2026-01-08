import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <LanguageSwitcher />
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>{t('nav.appName')}</h1>
        </div>
        <ul className="navbar-nav">
          <li className={`nav-item ${isActive('/')}`}>
            <Link to="/" className="nav-link">{t('nav.dashboard')}</Link>
          </li>
          <li className={`nav-item ${isActive('/buildings')}`}>
            <Link to="/buildings" className="nav-link">{t('nav.buildings')}</Link>
          </li>
          <li className={`nav-item ${isActive('/units')}`}>
            <Link to="/units" className="nav-link">{t('nav.units')}</Link>
          </li>
          <li className={`nav-item ${isActive('/tenants')}`}>
            <Link to="/tenants" className="nav-link">{t('nav.tenants')}</Link>
          </li>
          <li className={`nav-item ${isActive('/rent-payments')}`}>
            <Link to="/rent-payments" className="nav-link">{t('nav.rentPayments')}</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
