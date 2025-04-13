import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Buildings from './pages/Buildings';
import Units from './pages/Units';
import Tenants from './pages/Tenants';
import RentPayments from './pages/RentPayments';
import BuildingDetails from './pages/BuildingDetails';
import UnitDetails from './pages/UnitDetails';
import TenantDetails from './pages/TenantDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/buildings/:id" element={<BuildingDetails />} />
            <Route path="/units" element={<Units />} />
            <Route path="/units/:id" element={<UnitDetails />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/tenants/:id" element={<TenantDetails />} />
            <Route path="/rent-payments" element={<RentPayments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;