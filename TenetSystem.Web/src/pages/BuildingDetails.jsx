import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buildingsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import BuildingForm from '../components/BuildingForm';
import './BuildingDetails.css';

function BuildingDetails() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
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

  if (loading) return <div>{t('common.loading')}</div>;
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
          &larr; {t('buildings.backToBuildings')}
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
          &larr; {t('buildings.backToBuildings')}
        </button>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsEditing(true)}>{t('buildings.editBuilding')}</button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>{t('buildings.deleteBuilding')}</button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <Card>
            <h3>{t('buildings.confirmDelete')}</h3>
            <p>{t('buildings.confirmDeleteMessage')}</p>
            <div className="confirmation-actions">
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>{t('buildings.cancel')}</button>
              <button className="btn btn-danger" onClick={handleDelete}>{t('buildings.deleteBuilding')}</button>
            </div>
          </Card>
        </div>
      )}
      
      {building && (
        <div className="building-details">
          <Card title={building.name}>
            <div className="detail-row">
              <span className="detail-label">{t('buildings.details.address')}:</span>
              <span className="detail-value">{building.address}</span>
            </div>
            
            {building.description && (
              <div className="detail-row">
                <span className="detail-label">{t('buildings.details.description')}:</span>
                <span className="detail-value">{building.description}</span>
              </div>
            )}
          </Card>
          
          <Card title={t('buildings.details.units')}>
            {building.units && building.units.length > 0 ? (
              <div className="units-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t('units.unitNumber')}</th>
                      <th>{t('units.type')}</th>
                      <th>{t('common.status')}</th>
                      <th>{t('units.lastRent')}</th>
                      <th>{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {building.units.map(unit => (
                      <tr key={unit.id}>
                        <td>{unit.unitNumber}</td>
                        <td>{unit.type}</td>
                        <td>
                          <span className={`badge ${unit.currentTenantId ? 'badge-success' : 'badge-danger'}`}>
                            {unit.currentTenantId ? t('units.occupied') : t('units.vacant')}
                          </span>
                        </td>
                        <td>${unit.lastRentAmount}</td>
                        <td>
                          <Link to={`/units/${unit.id}`} className="btn">{t('common.view')}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>{t('buildings.details.noUnits')}</p>
                <Link to="/units/new" className="btn">{t('buildings.details.addUnit')}</Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default BuildingDetails;