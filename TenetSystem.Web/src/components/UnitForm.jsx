import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { unitsApi, buildingsApi } from '../services/api';
import Card from './Card';
import './UnitForm.css';

function UnitForm({ unit, isEditing = false }) {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [formData, setFormData] = useState({
    buildingId: '',
    unitNumber: '',
    type: 'Apartment',
    lastRentAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await buildingsApi.getAll();
        setBuildings(response.data);
        
        if (unit) {
          setFormData({
            buildingId: unit.buildingId || '',
            unitNumber: unit.unitNumber || '',
            type: unit.type || 'Apartment',
            lastRentAmount: unit.lastRentAmount || ''
          });
        } else if (response.data.length > 0) {
          // Set default buildingId if no unit is provided and buildings exist
          setFormData(prev => ({ ...prev, buildingId: response.data[0].id }));
        }
        
        setInitialLoading(false);
      } catch (err) {
        console.error('Error fetching buildings:', err);
        setError('Failed to load buildings. Please try again later.');
        setInitialLoading(false);
      }
    };

    fetchBuildings();
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

  if (initialLoading) return <div>Loading form data...</div>;

  return (
    <Card title={isEditing ? 'Edit Unit' : 'Add New Unit'}>
      <form onSubmit={handleSubmit} className="unit-form">
        <div className="form-group">
          <label htmlFor="buildingId">Building*</label>
          <select 
            id="buildingId" 
            name="buildingId" 
            className="form-control" 
            value={formData.buildingId} 
            onChange={handleInputChange}
            required
          >
            <option value="">Select Building</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>{building.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="unitNumber">Unit Number*</label>
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
          <label htmlFor="type">Unit Type*</label>
          <select 
            id="type" 
            name="type" 
            className="form-control" 
            value={formData.type} 
            onChange={handleInputChange}
            required
          >
            <option value="Apartment">Apartment</option>
            <option value="Shop">Shop</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="lastRentAmount">Last Rent Amount</label>
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
            Cancel
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Unit'}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default UnitForm;