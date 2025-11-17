import { useState, useEffect } from 'react';
import Select from 'react-select'
import { Link } from 'react-router-dom';
import { rentReceiptsApi, tenantsApi, unitsApi } from '../services/api';
import Card from '../components/Card';
import './RentPayments.css';
import { useMemo } from 'react';

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
    paymentDate: new Date().toISOString().split('T')[0],
    rentMonth: '',
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

  // Fetch next unpaid month when tenant and unit are selected
  useEffect(() => {
    const fetchNextUnpaidMonth = async () => {
      console.log('teeessst')
      if (paymentData.tenantId && paymentData.unitId) {
        try {
          const response = await rentReceiptsApi.getNextUnpaidMonth(
            paymentData.tenantId,
            paymentData.unitId
          );
          
          if (response.data) {
            const nextMonth = new Date(response.data);
            const formattedMonth = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
            setPaymentData(prev => ({ ...prev, rentMonth: formattedMonth }));
          }
        } catch (err) {
          console.error('Error fetching next unpaid month:', err);
        }
      }
    };

    fetchNextUnpaidMonth();
  }, [paymentData.tenantId, paymentData.unitId]);

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
      // Convert YYYY-MM to first day of month
      const [year, month] = paymentData.rentMonth.split('-');
      const rentMonthDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 12, 0, 0));

      await rentReceiptsApi.recordPayment({
        tenantId: parseInt(paymentData.tenantId),
        unitId: parseInt(paymentData.unitId),
        amount: parseFloat(paymentData.amount),
        paymentDate: new Date(paymentData.paymentDate),
        rentMonth: rentMonthDate,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes
      });
      
      setSubmitSuccess(true);
      setShowRecordPayment(false);
      setPaymentData({
        tenantId: '',
        unitId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        rentMonth: '',
        paymentMethod: 'Cash',
        notes: ''
      });
    } catch (err) {
      console.error('Error recording payment:', err);
      const errorMessage = err.response?.data || 'Failed to record payment. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const tenantUnits = useMemo(() => {
    if (!paymentData.tenantId) return units;
    return units.filter(u => u.currentTenantId === parseInt(paymentData.tenantId));
  }, [units, paymentData.tenantId]);

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
              <Select
                id="tenantId"
                name="tenantId"
                options={tenants.map(tenant => ({
                  value: tenant.id,
                  label: tenant.name
                }))}
                value={
                  tenants
                    .filter(t => t.id === parseInt(paymentData.tenantId))
                    .map(t => ({ value: t.id, label: t.name }))[0] || null
                }
                onChange={option => {
                  const tenantId = option ? option.value : '';
                  setPaymentData(prev => ({ ...prev, tenantId, unitId: '', amount: '', rentMonth: '' }));

                  if (tenantId) {
                    const tenantUnitsList = units.filter(u => u.currentTenantId === tenantId);
                    if (tenantUnitsList.length === 1) {
                      setPaymentData(prev => ({
                        ...prev,
                        unitId: tenantUnitsList[0].id,
                        amount: tenantUnitsList[0].lastRentAmount?.toString() || ''
                      }));
                    }
                  }
                }}
                placeholder="Select or search tenant..."
                isClearable
              />
            </div>

            <div className="form-group">
              <label htmlFor="unitId">Unit</label>
              <Select
                id="unitId"
                name="unitId"
                options={tenantUnits.map(unit => ({
                  value: unit.id,
                  label: `${unit.building?.name || 'Unknown Building'} - Unit ${unit.unitNumber}`
                }))}
                value={
                  units
                    .filter(u => u.id === parseInt(paymentData.unitId))
                    .map(u => ({
                      value: u.id,
                      label: `${u.building?.name || 'Unknown Building'} - Unit ${u.unitNumber}`
                    }))[0] || null
                }
                onChange={option => {
                  const unitId = option ? option.value : '';
                  setPaymentData(prev => ({ ...prev, unitId, rentMonth: '' }));

                  if (unitId) {
                    const selectedUnit = units.find(u => u.id === unitId);
                    if (selectedUnit) {
                      setPaymentData(prev => ({
                        ...prev,
                        tenantId: selectedUnit.currentTenantId || '',
                        amount: selectedUnit.lastRentAmount?.toString() || ''
                      }));
                    }
                  } else {
                    setPaymentData(prev => ({ ...prev, tenantId: '', amount: '' }));
                  }
                }}
                placeholder="Select or search unit..."
                isClearable
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
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
              <label htmlFor="paymentDate">Payment Date</label>
              <input 
                type="date" 
                id="paymentDate" 
                name="paymentDate" 
                className="form-control" 
                value={paymentData.paymentDate} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rentMonth">Rent Month</label>
              <input 
                type="month" 
                id="rentMonth" 
                name="rentMonth" 
                className="form-control" 
                value={paymentData.rentMonth} 
                onChange={handleInputChange}
                required
              />
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
                <th>Payment Date</th>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>Rent Period</th>
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