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

  // Check if tenant is current (has active tenant history)
  const isCurrentTenant = tenant?.tenantHistories?.some(th => th.moveOutDate === null) || false;
  
  // Get current occupancy info
  const currentOccupancy = tenant?.tenantHistories?.find(th => th.moveOutDate === null);

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
              <span className={`badge ${isCurrentTenant ? 'badge-success' : 'badge-danger'}`}>
                {isCurrentTenant ? 'Current Tenant' : 'Former Tenant'}
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
            
            {currentOccupancy && (
              <div className="detail-row">
                <span className="detail-label">Current Unit:</span>
                <span className="detail-value">
                  <Link to={`/units/${currentOccupancy.unitId}`}>
                    Unit {currentOccupancy.unit?.unitNumber || currentOccupancy.unitId}
                  </Link>
                </span>
              </div>
            )}
            
            {currentOccupancy && (
              <div className="detail-row">
                <span className="detail-label">Move-in Date:</span>
                <span className="detail-value">
                  {new Date(currentOccupancy.moveInDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </Card>
          
          <Card title="Occupancy History">
            {tenant.tenantHistories && tenant.tenantHistories.length > 0 ? (
              <div className="units-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Move-in Date</th>
                      <th>Move-out Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.tenantHistories.map(history => (
                      <tr key={history.id}>
                        <td>
                          <Link to={`/units/${history.unitId}`}>
                            Unit {history.unit?.unitNumber || history.unitId}
                          </Link>
                        </td>
                        <td>{new Date(history.moveInDate).toLocaleDateString()}</td>
                        <td>{history.moveOutDate ? new Date(history.moveOutDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <span className={`badge ${history.moveOutDate ? 'badge-danger' : 'badge-success'}`}>
                            {history.moveOutDate ? 'Past' : 'Current'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No occupancy history found.</p>
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