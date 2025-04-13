import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantsApi, unitsApi } from '../services/api';
import Card from './Card';
import './TenantForm.css';

function TenantForm({ tenant, isEditing = false, isMoveIn = false }) {
  const navigate = useNavigate();
  const [vacantUnits, setVacantUnits] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    moveInDate: new Date().toISOString().split('T')[0],
    unitId: '',
    rentAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isMoveIn) {
          const response = await unitsApi.getVacant();
          setVacantUnits(response.data);
          
          if (response.data.length > 0) {
            setFormData(prev => ({ 
              ...prev, 
              unitId: response.data[0].id,
              rentAmount: response.data[0].lastRentAmount || ''
            }));
          }
        }
        
        if (tenant && isEditing) {
          setFormData({
            name: tenant.name || '',
            phoneNumber: tenant.phoneNumber || '',
            email: tenant.email || '',
            address: tenant.address || '',
            moveInDate: tenant.moveInDate ? new Date(tenant.moveInDate).toISOString().split('T')[0] : '',
            unitId: '',
            rentAmount: ''
          });
        }
        
        setInitialLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [tenant, isEditing, isMoveIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If selecting a unit, update the default rent amount
    if (name === 'unitId') {
      const selectedUnit = vacantUnits.find(unit => unit.id === parseInt(value));
      if (selectedUnit) {
        setFormData(prev => ({ ...prev, rentAmount: selectedUnit.lastRentAmount || '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && tenant) {
        await tenantsApi.update(tenant.id, {
          ...tenant,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          moveInDate: formData.moveInDate
        });
        navigate(`/tenants/${tenant.id}`);
      } else if (isMoveIn) {
        // Process move-in
        await tenantsApi.moveIn({
          unitId: parseInt(formData.unitId),
          tenant: {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            address: formData.address,
            moveInDate: formData.moveInDate
          },
          rentAmount: parseFloat(formData.rentAmount) || 0
        });
        navigate('/tenants');
      } else {
        // Just create a tenant without move-in
        await tenantsApi.create({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          moveInDate: formData.moveInDate
        });
        navigate('/tenants');
      }
    } catch (err) {
      console.error('Error saving tenant:', err);
      setError('Failed to save tenant. Please try again.');
      setLoading(false);
    }
  };

  if (initialLoading) return <div>Loading form data...</div>;

  return (
    <Card title={isEditing ? 'Edit Tenant' : (isMoveIn ? 'Move-In New Tenant' : 'Add New Tenant')}>
      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-group">
          <label htmlFor="name">Tenant Name*</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className="form-control" 
            value={formData.name} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number*</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            name="phoneNumber" 
            className="form-control" 
            value={formData.phoneNumber} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-control" 
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            className="form-control" 
            value={formData.address} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="moveInDate">Move-In Date*</label>
          <input 
            type="date" 
            id="moveInDate" 
            name="moveInDate" 
            className="form-control" 
            value={formData.moveInDate} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        {isMoveIn && (
          <>
            <div className="form-group">
              <label htmlFor="unitId">Unit*</label>
              <select 
                id="unitId" 
                name="unitId" 
                className="form-control" 
                value={formData.unitId} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select Unit</option>
                {vacantUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.building?.name || 'Unknown Building'} - Unit {unit.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rentAmount">Rent Amount ($)*</label>
              <input 
                type="number" 
                id="rentAmount" 
                name="rentAmount" 
                className="form-control" 
                value={formData.rentAmount} 
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/tenants')}
          >
            Cancel
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Tenant' : (isMoveIn ? 'Move In Tenant' : 'Add Tenant'))}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default TenantForm;