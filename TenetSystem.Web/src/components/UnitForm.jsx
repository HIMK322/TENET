import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { unitsApi, buildingsApi, tenantsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n';
import Card from './Card';
import './UnitForm.css';

function UnitForm({ unit, isEditing = false }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [buildings, setBuildings] = useState([]);
  const [tenets, setTenets] = useState([]);
  const [formData, setFormData] = useState({
    buildingId: '',
    unitNumber: '',
    type: '1',
    rentPeriod: '0', // 0 = Monthly, 1 = Yearly
    lastRentAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingResponse = await buildingsApi.getAll();
        setBuildings(buildingResponse.data);
  
        const tenetResponse = await tenantsApi.getAll();
        setTenets(tenetResponse.data);
        
        if (unit) {
          setFormData({
            buildingId: unit.buildingId || '',
            tenetId: unit.tenetId || '',
            unitNumber: unit.unitNumber || '',
            type: unit.type?.toString() || '1',
            rentPeriod: unit.rentPeriod === 'Yearly' ? '1' : '0',
            lastRentAmount: unit.lastRentAmount || ''
          });
        } else if (buildingResponse.data.length > 0) {
          setFormData(prev => ({ ...prev, buildingId: buildingResponse.data[0].id }));
        }
        
        setInitialLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data. Please try again later.');
        setInitialLoading(false);
      }
    };
  
    fetchData();
  }, [unit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formattedData = {
        ...formData,
        buildingId: parseInt(formData.buildingId),
        currentTenantId: parseInt(formData.tenetId) || null,
        type: formData.type === '0' ? 0 : 1,
        rentPeriod: parseInt(formData.rentPeriod),
        lastRentAmount: parseFloat(formData.lastRentAmount) || 0
      };
      
      if (isEditing && unit) {
        await unitsApi.update(unit.id, {
          ...unit,
          ...formattedData
        });
      } else {
        await unitsApi.create(formattedData);
      }
      
      navigate('/units');
    } catch (err) {
      console.error('Error saving unit:', err);
      setError('Failed to save unit. Please try again.');
      setLoading(false);
    }
  };

  if (initialLoading) return <div>{t('common.loading')}</div>;

  return (
    <Card title={isEditing ? t('units.form.editTitle') : t('units.form.title')}>
      <form onSubmit={handleSubmit} className="unit-form">
        <div className="form-group">
          <label htmlFor="buildingId">{t('units.form.building')}</label>
          <select 
            id="buildingId" 
            name="buildingId" 
            className="form-control" 
            value={formData.buildingId} 
            onChange={handleInputChange}
            required
          >
            <option value="">{t('units.form.selectBuilding')}</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>{building.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="tenetId">{t('units.form.tenant')}</label>
          <select 
            id="tenetId" 
            name="tenetId" 
            className="form-control" 
            value={formData.tenetId} 
            onChange={handleInputChange}
          >
            <option value="">{t('units.form.selectTenant')}</option>
            {tenets.map(tenet => (
              <option key={tenet.id} value={tenet.id}>
                {tenet.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="unitNumber">{t('units.form.unitNumber')}</label>
          <input 
            type="text" 
            id="unitNumber" 
            name="unitNumber" 
            className="form-control" 
            value={formData.unitNumber} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">{t('units.form.type')}</label>
          <select 
            id="type" 
            name="type" 
            className="form-control" 
            value={formData.type} 
            onChange={handleInputChange}
            required
          >
            <option value="1">{t('units.types.apartment')}</option>
            <option value="0">{t('units.types.shop')}</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="rentPeriod">{t('units.form.rentPeriod')}</label>
          <select 
            id="rentPeriod" 
            name="rentPeriod" 
            className="form-control" 
            value={formData.rentPeriod} 
            onChange={handleInputChange}
            required
          >
            <option value="0">{t('units.monthly')}</option>
            <option value="1">{t('units.yearly')}</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="lastRentAmount">{t('units.form.lastRentAmount')}</label>
          <input 
            type="number" 
            id="lastRentAmount" 
            name="lastRentAmount" 
            className="form-control" 
            value={formData.lastRentAmount} 
            onChange={handleInputChange}
            step="0.01"
            min="0"
          />
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/units')}>
            {t('units.form.cancel')}
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? t('units.form.saving') : t('units.form.save')}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default UnitForm;
