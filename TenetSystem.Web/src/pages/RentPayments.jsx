import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentReceiptsApi, tenantsApi, unitsApi } from '../services/api';
import Card from '../components/Card';
import './RentPayments.css';

function RentPayments() {
  const [receipts, setReceipts] = useState([]);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({
    tenantId: '',
    unitId: '',
    amount: '',
    rentMonth: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    paymentMethod: 'Cash',
    notes: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsRes, tenantsRes, unitsRes] = await Promise.all([
          rentReceiptsApi.getAll(),
          tenantsApi.getCurrent(),
          unitsApi.getAll()
        ]);
        
        setReceipts(receiptsRes.data);
        setTenants(tenantsRes.data);
        setUnits(unitsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [submitSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      await rentReceiptsApi.recordPayment({
        tenantId: parseInt(paymentData.tenantId),
        unitId: parseInt(paymentData.unitId),
        amount: parseFloat(paymentData.amount),
        rentMonth: new Date(paymentData.rentMonth),
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes
      });
      
      setSubmitSuccess(true);
      setShowRecordPayment(false);
      setPaymentData({
        tenantId: '',
        unitId: '',
        amount: '',
        rentMonth: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        notes: ''
      });
    } catch (err) {
      console.error('Error recording payment:', err);
      setSubmitError('Failed to record payment. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>Loading rent payments...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="rent-payments-page">
      <div className="page-header">
        <h1>Rent Payments</h1>
        <button 
          className="btn" 
          onClick={() => setShowRecordPayment(!showRecordPayment)}
        >
          {showRecordPayment ? 'Cancel' : 'Record Payment'}
        </button>
      </div>
      
      {submitSuccess && (
        <div className="alert alert-success">
          Payment recorded successfully!
        </div>
      )}
      
      {showRecordPayment && (
        <Card title="Record Rent Payment">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="tenantId">Tenant</label>
              <select 
                id="tenantId" 
                name="tenantId" 
                className="form-control" 
                value={paymentData.tenantId} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select Tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="unitId">Unit</label>
              <select 
                id="unitId" 
                name="unitId" 
                className="form-control" 
                value={paymentData.unitId} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.building?.name || 'Unknown Building'} - Unit {unit.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input 
                type="number" 
                id="amount" 
                name="amount" 
                className="form-control" 
                value={paymentData.amount} 
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rentMonth">Rent Month</label>
              <input 
                type="date" 
                id="rentMonth" 
                name="rentMonth" 
                className="form-control" 
                value={paymentData.rentMonth} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select 
                id="paymentMethod" 
                name="paymentMethod" 
                className="form-control" 
                value={paymentData.paymentMethod} 
                onChange={handleInputChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes" 
                name="notes" 
                className="form-control" 
                value={paymentData.notes} 
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>
            
            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}
            
            <button 
              type="submit" 
              className="btn" 
              disabled={submitLoading}
            >
              {submitLoading ? 'Recording...' : 'Record Payment'}
            </button>
          </form>
        </Card>
      )}
      
      <h2>Recent Payments</h2>
      
      {receipts.length === 0 ? (
        <div className="empty-state">
          <p>No rent payments recorded yet.</p>
          <button 
            className="btn" 
            onClick={() => setShowRecordPayment(true)}
          >
            Record First Payment
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>Rent Period</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(receipt => (
                <tr key={receipt.id}>
                  <td>{new Date(receipt.paymentDate).toLocaleDateString()}</td>
                  <td>{receipt.tenant?.name || 'Unknown'}</td>
                  <td>
                    {receipt.unit?.building?.name 
                      ? `${receipt.unit.building.name} - Unit ${receipt.unit.unitNumber}` 
                      : `Unit ${receipt.unit?.unitNumber || 'Unknown'}`}
                  </td>
                  <td>${receipt.amountPaid}</td>
                  <td>{new Date(receipt.rentMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</td>
                  <td>{receipt.paymentMethod}</td>
                  <td>
                    <Link to={`/rent-payments/${receipt.id}`} className="btn">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RentPayments;