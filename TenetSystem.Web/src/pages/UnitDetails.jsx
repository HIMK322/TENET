import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { unitsApi, tenantsApi, rentReceiptsApi } from '../services/api';
import Card from '../components/Card';
import UnitForm from '../components/UnitForm';
import './UnitDetails.css';

function UnitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [rentHistory, setRentHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoveOutConfirm, setShowMoveOutConfirm] = useState(false);

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        if (id === 'new') {
          setLoading(false);
          return;
        }
        
        const unitResponse = await unitsApi.getById(id);
        setUnit(unitResponse.data);
        
        const rentHistoryResponse = await rentReceiptsApi.getByUnit(id);
        setRentHistory(rentHistoryResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching unit data:', err);
        setError('Failed to load unit details. Please try again later.');
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await unitsApi.delete(id);
      navigate('/units');
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError('Failed to delete unit. Please try again.');
    }
  };

  const handleMoveOut = async () => {
    try {
      await tenantsApi.moveOut(id);
      
      // Reload unit data
      const response = await unitsApi.getById(id);
      setUnit(response.data);
      
      setShowMoveOutConfirm(false);
    } catch (err) {
      console.error('Error moving out tenant:', err);
      setError('Failed to move out tenant. Please try again.');
    }
  };

  if (loading) return <div>Loading unit details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // New unit form
  if (id === 'new') {
    return <UnitForm />;
  }
  
  // Edit existing unit
  if (isEditing && unit) {
    return (
      <div>
        <button className="btn-link back-link" onClick={() => setIsEditing(false)}>
          &larr; Back to Unit Details
        </button>
        <UnitForm unit={unit} isEditing={true} />
      </div>
    );
  }

  // Unit details view
  return (
    <div className="unit-details-page">
      <div className="page-header">
        <button className="btn-link back-link" onClick={() => navigate('/units')}>
          &larr; Back to Units
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>Edit Unit</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this unit? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Unit</button>
            </div>
          </Card>
        </div>
      )}
      
      {showMoveOutConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>Confirm Move Out</h3>
            <p>Are you sure you want to move out the current tenant? This action will mark the unit as vacant.</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowMoveOutConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleMoveOut}>Confirm Move Out</button>
            </div>
          </Card>
        </div>
      )}
      
      {unit && (
        <div className="unit-details">
          <Card title={`Unit ${unit.unitNumber}`}>
            <div className="unit-status">
              <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                {unit.currentTenantId ? 'Occupied' : 'Vacant'}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Building:</span>
              <span className="detail-value">
                <Link to={`/buildings/${unit.buildingId}`}>
                  {unit.building?.name || 'Unknown Building'}
                </Link>
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{unit.type}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Last Rent Amount:</span>
              <span className="detail-value">${unit.lastRentAmount}</span>
            </div>
          </Card>
          
          <Card title="Current Tenant">
            {unit.currentTenant ? (
              <div className="tenant-info">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    <Link to={`/tenants/${unit.currentTenant.id}`}>
                      {unit.currentTenant.name}
                    </Link>
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{unit.currentTenant.phoneNumber}</span>
                </div>
                
                {unit.currentTenant.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{unit.currentTenant.email}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="detail-label">Move-in Date:</span>
                  <span className="detail-value">
                    {new Date(unit.currentTenant.moveInDate).toLocaleDateString()}
                  </span>
                </div>
                
                <button 
                  className="btn btn-danger" 
                  onClick={() => setShowMoveOutConfirm(true)}
                >
                  Move Out Tenant
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <p>This unit is currently vacant.</p>
                <Link to={`/tenants/move-in?unitId=${unit.id}`} className="btn">
                  Move In Tenant
                </Link>
              </div>
            )}
          </Card>
          
          <Card title="Rent History">
            {rentHistory.length > 0 ? (
              <div className="rent-history-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Tenant</th>
                      <th>Amount</th>
                      <th>Rent Period</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentHistory.map(receipt => (
                      <tr key={receipt.id}>
                        <td>{new Date(receipt.paymentDate).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/tenants/${receipt.tenantId}`}>
                            {receipt.tenant?.name || 'Unknown'}
                          </Link>
                        </td>
                        <td>${receipt.amountPaid}</td>
                        <td>{new Date(receipt.rentMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</td>
                        <td>{receipt.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No rent payments recorded for this unit.</p>
                <Link to="/rent-payments/new" className="btn">Record Payment</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default UnitDetails;