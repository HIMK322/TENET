import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import './Tenants.css';

function Tenants() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await tenantsApi.getAll();
        setTenants(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="tenants-page">
      <div className="page-header">
        <h1>{t('tenants.title')}</h1>
        <Link to="/tenants/new" className="btn">{t('tenants.addNew')}</Link>
      </div>
      
      {tenants.length === 0 ? (
        <div className="empty-state">
          <p>{t('tenants.noTenants')}</p>
          <Link to="/tenants/new" className="btn">{t('tenants.addNew')}</Link>
        </div>
      ) : (
        <div className="tenants-grid">
          {tenants.map(tenant => (
            <Card key={tenant.id} className="tenant-card">
              <h3>{tenant.name}</h3>
              <div className="tenant-info">
                <p>
                  <i className="icon-phone"></i> {tenant.phoneNumber}
                </p>
                {tenant.email && (
                  <p>
                    <i className="icon-email"></i> {tenant.email}
                  </p>
                )}
              </div>
              
              <div className="card-actions">
                <Link to={`/tenants/${tenant.id}`} className="btn">{t('tenants.viewDetails')}</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tenants;