import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildingsApi, unitsApi, tenantsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import './Dashboard.css';

function Dashboard() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [stats, setStats] = useState({
    buildings: 0,
    units: 0,
    vacantUnits: 0,
    tenants: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [buildingsRes, unitsRes, vacantUnitsRes, tenantsRes] = await Promise.all([
          buildingsApi.getAll(),
          unitsApi.getAll(),
          unitsApi.getVacant(),
          tenantsApi.getCurrent()
        ]);

        setStats({
          buildings: buildingsRes.data.length,
          units: unitsRes.data.length,
          vacantUnits: vacantUnitsRes.data.length,
          tenants: tenantsRes.data.length
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard">
      <h1>{t('dashboard.title')}</h1>
      
      <div className="stats-grid">
        <Card className="stats-card">
          <div className="stat-value">{stats.buildings}</div>
          <div className="stat-label">{t('dashboard.stats.buildings')}</div>
          <Link to="/buildings" className="btn">{t('dashboard.stats.viewAll')}</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.units}</div>
          <div className="stat-label">{t('dashboard.stats.totalUnits')}</div>
          <Link to="/units" className="btn">{t('dashboard.stats.viewAll')}</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.vacantUnits}</div>
          <div className="stat-label">{t('dashboard.stats.vacantUnits')}</div>
          <Link to="/units?filter=vacant" className="btn">{t('dashboard.stats.viewAll')}</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.tenants}</div>
          <div className="stat-label">{t('dashboard.stats.currentTenants')}</div>
          <Link to="/tenants" className="btn">{t('dashboard.stats.viewAll')}</Link>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2>{t('dashboard.quickActions.title')}</h2>
        <div className="actions-grid">
          <Link to="/units?filter=vacant" className="action-card">
            <h3>{t('dashboard.quickActions.viewVacantUnits')}</h3>
            <p>{t('dashboard.quickActions.viewVacantUnitsDesc')}</p>
          </Link>
          
          <Link to="/tenants/new" className="action-card">
            <h3>{t('dashboard.quickActions.addNewTenant')}</h3>
            <p>{t('dashboard.quickActions.addNewTenantDesc')}</p>
          </Link>
          
          <Link to="/rent-payments/new" className="action-card">
            <h3>{t('dashboard.quickActions.recordRentPayment')}</h3>
            <p>{t('dashboard.quickActions.recordRentPaymentDesc')}</p>
          </Link>
          
          <Link to="/buildings/new" className="action-card">
            <h3>{t('dashboard.quickActions.addNewBuilding')}</h3>
            <p>{t('dashboard.quickActions.addNewBuildingDesc')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;