import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { tenantsApi } from '../services/api';
import Card from '../components/Card';
import TenantForm from '../components/TenantForm';
import './TenantDetails.css';

function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tenant, setTenant] = useState(null);
  const [rentHistory, setRentHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isMoveIn, setIsMoveIn] = useState(location.pathname.includes('move-in'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        if (id === 'new' || isMoveIn) {
          setLoading(false);
          return;
        }
        
        const tenantResponse = await tenantsApi.getById(id);
        setTenant(tenantResponse.data);
        
        const rentHistoryResponse = await tenantsApi.getRentHistory(id);
        setRentHistory(rentHistoryResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load tenant details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [id, isMoveIn]);

  const handleDelete = async () => {
    try {
      await tenantsApi.delete(id);
      navigate('/tenants');
    } catch (err) {
      console.error('Error deleting tenant:', err);
      setError('Failed to delete tenant. Please try again.');
    }
  };

  if (loading) return <div>Loading tenant details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // New tenant or move-in form
  if (id === 'new' || isMoveIn) {
    return <TenantForm isMoveIn={isMoveIn} />;
  }
  
  // Edit existing tenant
  if (isEditing && tenant) {
    return (
      <div>
        <button className="btn-link back-link" onClick={() => setIsEditing(false)}>
          &larr; Back to Tenant Details
        </button>
        <TenantForm tenant={tenant} isEditing={true} />
      </div>
    );
  }

  // Tenant details view
  return (
    <div className="tenant-details-page">
      <div className="page-header">
        <button className="btn-link back-link" onClick={() => navigate('/tenants')}>
          &larr; Back to Tenants
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>Edit Tenant</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this tenant? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Tenant</button>
            </div>
          </Card>
        </div>
      )}
      
      {tenant && (
        <div className="tenant-details">
          <Card title={tenant.name}>
            <div className="tenant-status">
              <span className={`badge ${tenant.moveOutDate ? 'badge-danger' : 'badge-success'}`}>
                {tenant.moveOutDate ? 'Former Tenant' : 'Current Tenant'}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{tenant.phoneNumber}</span>
            </div>
            
            {tenant.email && (
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{tenant.email}</span>
              </div>
            )}
            
            {tenant.address && (
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{tenant.address}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">Move-in Date:</span>
              <span className="detail-value">
                {new Date(tenant.moveInDate).toLocaleDateString()}
              </span>
            </div>
            
            {tenant.moveOutDate && (
              <div className="detail-row">
                <span className="detail-label">Move-out Date:</span>
                <span className="detail-value">
                  {new Date(tenant.moveOutDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </Card>
          
          <Card title="Occupied Units">
            {tenant.units && tenant.units.length > 0 ? (
              <div className="units-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Building</th>
                      <th>Unit</th>
                      <th>Type</th>
                      <th>Last Rent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.units.map(unit => (
                      <tr key={unit.id}>
                        <td>{unit.building?.name || 'Unknown Building'}</td>
                        <td>{unit.unitNumber}</td>
                        <td>{unit.type}</td>
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
                <p>This tenant is not currently occupying any units.</p>
                <Link to={`/tenants/move-in?tenantId=${tenant.id}`} className="btn">
                  Move In Tenant
                </Link>
              </div>
            )}
          </Card>
          
          <Card title="Rent Payment History">
            {rentHistory.length > 0 ? (
              <div className="rent-history-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Unit</th>
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
                          <Link to={`/units/${receipt.unitId}`}>
                            {receipt.unit?.unitNumber || 'Unknown Unit'}
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
                <p>No rent payments recorded for this tenant.</p>
                <Link to="/rent-payments/new" className="btn">Record Payment</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default TenantDetails;