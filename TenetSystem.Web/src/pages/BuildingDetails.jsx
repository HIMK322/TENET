import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buildingsApi } from '../services/api';
import Card from '../components/Card';
import BuildingForm from '../components/BuildingForm';
import './BuildingDetails.css';

function BuildingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        if (id === 'new') {
          setLoading(false);
          return;
        }
        
        const response = await buildingsApi.getById(id);
        setBuilding(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching building:', err);
        setError('Failed to load building details. Please try again later.');
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [id]);

  const handleDelete = async () => {
    try {
      await buildingsApi.delete(id);
      navigate('/buildings');
    } catch (err) {
      console.error('Error deleting building:', err);
      setError('Failed to delete building. Please try again.');
    }
  };

  if (loading) return <div>Loading building details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // New building form
  if (id === 'new') {
    return <BuildingForm />;
  }
  
  // Edit existing building
  if (isEditing && building) {
    return (
      <div>
        <button className="btn-link back-link" onClick={() => setIsEditing(false)}>
          &larr; Back to Building Details
        </button>
        <BuildingForm building={building} isEditing={true} />
      </div>
    );
  }

  // Building details view
  return (
    <div className="building-details-page">
      <div className="page-header">
        <button className="btn-link back-link" onClick={() => navigate('/buildings')}>
          &larr; Back to Buildings
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>Edit Building</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this building? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Building</button>
            </div>
          </Card>
        </div>
      )}
      
      {building && (
        <div className="building-details">
          <Card title={building.name}>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{building.address}</span>
            </div>
            
            {building.description && (
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{building.description}</span>
              </div>
            )}
          </Card>
          
          <Card title="Units">
            {building.units && building.units.length > 0 ? (
              <div className="units-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Unit Number</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Last Rent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {building.units.map(unit => (
                      <tr key={unit.id}>
                        <td>{unit.unitNumber}</td>
                        <td>{unit.type}</td>
                        <td>
                          <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                            {unit.currentTenantId ? 'Occupied' : 'Vacant'}
                          </span>
                        </td>
                        <td>${unit.lastRentAmount}</td>
                        <td>
                          <Link to={`/units/${unit.id}`} className="btn">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No units found in this building.</p>
                <Link to="/units/new" className="btn">Add Unit</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default BuildingDetails;