import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildingsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import './Buildings.css';

function Buildings() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await buildingsApi.getAll();
        setBuildings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching buildings:', err);
        setError('Failed to load buildings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="buildings-page">
      <div className="page-header">
        <h1>{t('buildings.title')}</h1>
        <Link to="/buildings/new" className="btn">{t('buildings.addNew')}</Link>
      </div>
      
      {buildings.length === 0 ? (
        <div className="empty-state">
          <p>{t('buildings.noBuildings')}</p>
          <Link to="/buildings/new" className="btn">{t('buildings.addNew')}</Link>
        </div>
      ) : (
        <div className="buildings-grid">
          {buildings.map(building => (
            <Card key={building.id} className="building-card">
              <h3>{building.name}</h3>
              <p className="building-address">{building.address}</p>
              <div className="building-stats">
                <div className="stat">
                  <span className="stat-value">{building.units?.length || 0}</span>
                  <span className="stat-label">{t('buildings.units')}</span>
                </div>
              </div>
              <div className="card-actions">
                <Link to={`/buildings/${building.id}`} className="btn">{t('buildings.viewDetails')}</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Buildings;