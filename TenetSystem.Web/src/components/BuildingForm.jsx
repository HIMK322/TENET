import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildingsApi } from '../services/api';
import Card from './Card';
import './BuildingForm.css';

function BuildingForm({ building, isEditing = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    layoutMap: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name || '',
        address: building.address || '',
        description: building.description || '',
        layoutMap: building.layoutMap || ''
      });
    }
  }, [building]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && building) {
        await buildingsApi.update(building.id, {
          ...building,
          ...formData
        });
      } else {
        await buildingsApi.create(formData);
      }
      
      navigate('/buildings');
    } catch (err) {
      console.error('Error saving building:', err);
      setError('Failed to save building. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card title={isEditing ? 'Edit Building' : 'Add New Building'}>
      <form onSubmit={handleSubmit} className="building-form">
        <div className="form-group">
          <label htmlFor="name">Building Name*</label>
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
          <label htmlFor="address">Address*</label>
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
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            className="form-control" 
            value={formData.description} 
            onChange={handleInputChange}
            rows="1"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="layoutMap">Layout Map URL</label>
          <input 
            type="text" 
            id="layoutMap" 
            name="layoutMap" 
            className="form-control" 
            value={formData.layoutMap} 
            onChange={handleInputChange}
          />
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/buildings')}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Building'}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default BuildingForm;