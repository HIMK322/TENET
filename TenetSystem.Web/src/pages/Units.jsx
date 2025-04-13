import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { unitsApi } from '../services/api';
import Card from '../components/Card';
import './Units.css';

function Units() {
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

  if (loading) return <div>Loading units...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="units-page">
      <div className="page-header">
        <h1>{filterParam === 'vacant' ? 'Vacant Units' : 'All Units'}</h1>
        <div className="header-actions">
          {filterParam === 'vacant' ? (
            <Link to="/units" className="btn">View All Units</Link>
          ) : (
            <Link to="/units?filter=vacant" className="btn">View Vacant Only</Link>
          )}
          <Link to="/units/new" className="btn">Add New Unit</Link>
        </div>
      </div>
      
      {units.length === 0 ? (
        <div className="empty-state">
          <p>
            {filterParam === 'vacant' 
              ? 'No vacant units found.' 
              : 'No units found. Start by adding your first unit.'}
          </p>
          <Link to="/units/new" className="btn">Add New Unit</Link>
        </div>
      ) : (
        <div className="units-grid">
          {units.map(unit => (
            <Card key={unit.id} className="unit-card">
              <div className="unit-header">
                <h3>Unit {unit.unitNumber}</h3>
                <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                  {unit.currentTenantId ? 'Occupied' : 'Vacant'}
                </span>
              </div>
              <p className="unit-building">Building: {unit.building?.name || 'N/A'}</p>
              <p className="unit-type">Type: {unit.type}</p>
              <p className="unit-rent">Last Rent: ${unit.lastRentAmount}</p>
              
              {unit.currentTenant && (
                <div className="unit-tenant">
                  <p>Current Tenant: {unit.currentTenant.name}</p>
                </div>
              )}
              
              <div className="card-actions">
                <Link to={`/units/${unit.id}`} className="btn">View Details</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Units;