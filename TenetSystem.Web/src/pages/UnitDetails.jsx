import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { unitsApi, tenantsApi, rentReceiptsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import UnitForm from '../components/UnitForm';
import './UnitDetails.css';

function UnitDetails() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
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

  if (loading) return <div>{t('common.loading')}</div>;
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
          &larr; {t('units.backToUnits')}
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
          &larr; {t('units.backToUnits')}
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>{t('units.editUnit')}</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>{t('units.deleteUnit')}</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>{t('common.confirmDelete')}</h3>
            <p>{t('buildings.confirmDeleteMessage')}</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>{t('common.cancel')}</button>
              <button className="btn btn-danger" onClick={handleDelete}>{t('units.deleteUnit')}</button>
            </div>
          </Card>
        </div>
      )}
      
      {showMoveOutConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>{t('units.details.confirmMoveOut')}</h3>
            <p>{t('units.details.confirmMoveOutMessage')}</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowMoveOutConfirm(false)}>{t('common.cancel')}</button>
              <button className="btn btn-danger" onClick={handleMoveOut}>{t('units.details.confirmMoveOut')}</button>
            </div>
          </Card>
        </div>
      )}
      
      {unit && (
        <div className="unit-details">
          <Card title={`${t('units.unitNumber')} ${unit.unitNumber}`}>
            <div className="unit-status">
              <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                {unit.currentTenantId ? t('units.occupied') : t('units.vacant')}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">{t('units.details.building')}:</span>
              <span className="detail-value">
                <Link to={`/buildings/${unit.buildingId}`}>
                  {unit.building?.name || t('common.unknown')}
                </Link>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">{t('units.details.tenant')}:</span>
              <span className="detail-value">
                {unit.currentTenant ? (
                  <Link to={`/tenants/${unit.currentTenant.id}`}>
                    {unit.currentTenant.name}
                  </Link>
                ) : t('units.details.noTenant')}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">{t('units.details.type')}:</span>
              <span className="detail-value">{unit.type}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">{t('units.details.lastRentAmount')}:</span>
              <span className="detail-value">${unit.lastRentAmount}</span>
            </div>
          </Card>
          
          <Card title={t('units.details.rentHistory')}>
            {rentHistory.length > 0 ? (
              <div className="rent-history-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t('common.date')}</th>
                      <th>{t('rentPayments.table.tenant')}</th>
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
                          <Link to={`/tenants/${receipt.tenantId}`}>
                            {receipt.tenant?.name || t('common.unknown')}
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
                <p>{t('units.details.noRentHistory')}</p>
                <Link to="/rent-payments/new" className="btn">{t('units.details.recordPayment')}</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default UnitDetails;