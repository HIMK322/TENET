import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { unitsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import './Units.css';

function Units() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        let response;
        
        if (filterParam === 'vacant') {
          response = await unitsApi.getVacant();
        } else {
          response = await unitsApi.getAll();
        }
        
        setUnits(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching units:', err);
        setError('Failed to load units. Please try again later.');
        setLoading(false);
      }
    };

    fetchUnits();
  }, [filterParam]);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="units-page">
      <div className="page-header">
        <h1>{filterParam === 'vacant' ? t('units.vacantTitle') : t('units.title')}</h1>
        <div className="header-actions">
          {filterParam === 'vacant' ? (
            <Link to="/units" className="btn">{t('units.viewAll')}</Link>
          ) : (
            <Link to="/units?filter=vacant" className="btn">{t('units.viewVacantOnly')}</Link>
          )}
          <Link to="/units/new" className="btn">{t('units.addNew')}</Link>
        </div>
      </div>
      
      {units.length === 0 ? (
        <div className="empty-state">
          <p>
            {filterParam === 'vacant' 
              ? t('units.noVacantUnits')
              : t('units.noUnits')}
          </p>
          <Link to="/units/new" className="btn">{t('units.addNew')}</Link>
        </div>
      ) : (
        <div className="units-grid">
          {units.map(unit => (
            <Card key={unit.id} className="unit-card">
              <div className="unit-header">
                <h3>{t('units.unitNumber')} {unit.unitNumber}</h3>
                <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                  {unit.currentTenantId ? t('units.occupied') : t('units.vacant')}
                </span>
              </div>
              <p className="unit-building">{t('units.building')}: {unit.building?.name || t('common.na')}</p>
              <p className="unit-type">{t('units.type')}: {unit.type}</p>
              <p className="unit-rent">{t('units.lastRent')}: ${unit.lastRentAmount}</p>
              
              {unit.currentTenant && (
                <div className="unit-tenant">
                  <p>{t('units.currentTenant')}: {unit.currentTenant.name}</p>
                </div>
              )}
              
              <div className="card-actions">
                <Link to={`/units/${unit.id}`} className="btn">{t('units.viewDetails')}</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Units;