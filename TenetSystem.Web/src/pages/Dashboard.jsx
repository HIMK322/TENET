import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildingsApi, unitsApi, tenantsApi } from '../services/api';
import Card from '../components/Card';
import './Dashboard.css';

function Dashboard() {
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

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <Card className="stats-card">
          <div className="stat-value">{stats.buildings}</div>
          <div className="stat-label">Buildings</div>
          <Link to="/buildings" className="btn">View All</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.units}</div>
          <div className="stat-label">Total Units</div>
          <Link to="/units" className="btn">View All</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.vacantUnits}</div>
          <div className="stat-label">Vacant Units</div>
          <Link to="/units?filter=vacant" className="btn">View All</Link>
        </Card>
        
        <Card className="stats-card">
          <div className="stat-value">{stats.tenants}</div>
          <div className="stat-label">Current Tenants</div>
          <Link to="/tenants" className="btn">View All</Link>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/units?filter=vacant" className="action-card">
            <h3>View Vacant Units</h3>
            <p>Check available units for rent</p>
          </Link>
          
          <Link to="/tenants/new" className="action-card">
            <h3>Add New Tenant</h3>
            <p>Register a new tenant</p>
          </Link>
          
          <Link to="/rent-payments/new" className="action-card">
            <h3>Record Rent Payment</h3>
            <p>Add a new rent payment</p>
          </Link>
          
          <Link to="/buildings/new" className="action-card">
            <h3>Add New Building</h3>
            <p>Register a new property</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;