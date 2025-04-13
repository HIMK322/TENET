import axios from 'axios';

const API_URL = 'http://localhost:5154/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Buildings API
export const buildingsApi = {
  getAll: () => api.get('/buildings'),
  getById: (id) => api.get(`/buildings/${id}`),
  create: (building) => api.post('/buildings', building),
  update: (id, building) => api.put(`/buildings/${id}`, building),
  delete: (id) => api.delete(`/buildings/${id}`)
};

// Units API
export const unitsApi = {
  getAll: () => api.get('/units'),
  getById: (id) => api.get(`/units/${id}`),
  getVacant: () => api.get('/units/vacant'),
  create: (unit) => api.post('/units', unit),
  update: (id, unit) => api.put(`/units/${id}`, unit),
  delete: (id) => api.delete(`/units/${id}`)
};

// Tenants API
export const tenantsApi = {
  getAll: () => api.get('/tenants'),
  getById: (id) => api.get(`/tenants/${id}`),
  getCurrent: () => api.get('/tenants/current'),
  getRentHistory: (id) => api.get(`/tenants/${id}/RentHistory`),
  create: (tenant) => api.post('/tenants', tenant),
  update: (id, tenant) => api.put(`/tenants/${id}`, tenant),
  delete: (id) => api.delete(`/tenants/${id}`),
  moveIn: (moveInData) => api.post('/tenants/MoveIn', moveInData),
  moveOut: (unitId) => api.post(`/tenants/MoveOut/${unitId}`)
};

// Rent Receipts API
export const rentReceiptsApi = {
  getAll: () => api.get('/rentreceipts'),
  getById: (id) => api.get(`/rentreceipts/${id}`),
  getByUnit: (unitId) => api.get(`/rentreceipts/Unit/${unitId}`),
  create: (receipt) => api.post('/rentreceipts', receipt),
  recordPayment: (paymentData) => api.post('/rentreceipts/Record', paymentData),
  update: (id, receipt) => api.put(`/rentreceipts/${id}`, receipt),
  delete: (id) => api.delete(`/rentreceipts/${id}`)
};

export default {
  buildings: buildingsApi,
  units: unitsApi,
  tenants: tenantsApi,
  rentReceipts: rentReceiptsApi
};