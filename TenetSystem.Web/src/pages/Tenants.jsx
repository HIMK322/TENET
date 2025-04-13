import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantsApi } from '../services/api';
import Card from '../components/Card';
import './Tenants.css';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await tenantsApi.getCurrent();
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

  if (loading) return <div>Loading tenants...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="tenants-page">
      <div className="page-header">
        <h1>Current Tenants</h1>
        <Link to="/tenants/new" className="btn">Add New Tenant</Link>
      </div>
      
      {tenants.length === 0 ? (
        <div className="empty-state">
          <p>No tenants found. Start by adding your first tenant.</p>
          <Link to="/tenants/new" className="btn">Add New Tenant</Link>
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
                <p>
                  <i className="icon-calendar"></i> Move-in: {new Date(tenant.moveInDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="card-actions">
                <Link to={`/tenants/${tenant.id}`} className="btn">View Details</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tenants;