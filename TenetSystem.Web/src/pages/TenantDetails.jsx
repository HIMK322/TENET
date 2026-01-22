import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { tenantsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import TenantForm from '../components/TenantForm';
import './TenantDetails.css';

function TenantDetails() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
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

  if (loading) return <div>{t('common.loading')}</div>;
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
          &larr; {t('tenants.backToTenants')}
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
          &larr; {t('tenants.backToTenants')}
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>{t('tenants.editTenant')}</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>{t('tenants.deleteTenant')}</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>{t('common.confirmDelete')}</h3>
            <p>{t('buildings.confirmDeleteMessage')}</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>{t('common.cancel')}</button>
              <button className="btn btn-danger" onClick={handleDelete}>{t('tenants.deleteTenant')}</button>
            </div>
          </Card>
        </div>
      )}
      
      {tenant && (
        <div className="tenant-details">
          <Card title={tenant.name}>
            <div className="tenant-status">
              <span className={`badge ${isCurrentTenant ? 'badge-success' : 'badge-danger'}`}>
                {isCurrentTenant ? t('tenants.currentTenant') : t('tenants.formerTenant')}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">{t('tenants.details.phone')}:</span>
              <span className="detail-value">{tenant.phoneNumber}</span>
            </div>
            
            {tenant.email && (
              <div className="detail-row">
                <span className="detail-label">{t('tenants.details.email')}:</span>
                <span className="detail-value">{tenant.email}</span>
              </div>
            )}
            
            {tenant.address && (
              <div className="detail-row">
                <span className="detail-label">{t('tenants.details.address')}:</span>
                <span className="detail-value">{tenant.address}</span>
              </div>
            )}
            
            {currentOccupancy && (
              <div className="detail-row">
                <span className="detail-label">{t('tenants.details.currentUnit')}:</span>
                <span className="detail-value">
                  <Link to={`/units/${currentOccupancy.unitId}`}>
                    {t('units.unitNumber')} {currentOccupancy.unit?.unitNumber || currentOccupancy.unitId}
                  </Link>
                </span>
              </div>
            )}
            
            {currentOccupancy && (
              <div className="detail-row">
                <span className="detail-label">{t('tenants.details.moveInDate')}:</span>
                <span className="detail-value">
                  {new Date(currentOccupancy.moveInDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </Card>
          
          <Card title={t('tenants.details.occupancyHistory')}>
            {tenant.tenantHistories && tenant.tenantHistories.length > 0 ? (
              <div className="units-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t('units.unitNumber')}</th>
                      <th>{t('tenants.details.moveInDate')}</th>
                      <th>{t('rentPayments.table.rentMonth')}</th>
                      <th>{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.tenantHistories.map(history => (
                      <tr key={history.id}>
                        <td>
                          <Link to={`/units/${history.unitId}`}>
                            {t('units.unitNumber')} {history.unit?.unitNumber || history.unitId}
                          </Link>
                        </td>
                        <td>{new Date(history.moveInDate).toLocaleDateString()}</td>
                        <td>{history.moveOutDate ? new Date(history.moveOutDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <span className={`badge ${history.moveOutDate ? 'badge-danger' : 'badge-success'}`}>
                            {history.moveOutDate ? t('common.past') : t('common.current')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>{t('tenants.details.noOccupancyHistory')}</p>
              </div>
            )}
          </Card>
          
          <Card title={t('tenants.details.rentPaymentHistory')}>
            {rentHistory.length > 0 ? (
              <div className="rent-history-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t('common.date')}</th>
                      <th>{t('units.unitNumber')}</th>
                      <th>{t('common.amount')}</th>
                      <th>{t('rentPayments.table.rentMonth')}</th>
                      <th>{t('rentPayments.table.method')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentHistory.map(receipt => (
                      <tr key={receipt.id}>
                        <td>{new Date(receipt.paymentDate).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/units/${receipt.unitId}`}>
                            {receipt.unit?.unitNumber || t('common.unknown')}
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
                <p>{t('tenants.details.noRentHistory')}</p>
                <Link to="/rent-payments/new" className="btn">{t('tenants.details.recordPayment')}</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default TenantDetails;