import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Tenet System</h1>
      </div>
      <ul className="navbar-nav">
        <li className={`nav-item ${isActive('/')}`}>
          <Link to="/" className="nav-link">Dashboard</Link>
        </li>
        <li className={`nav-item ${isActive('/buildings')}`}>
          <Link to="/buildings" className="nav-link">Buildings</Link>
        </li>
        <li className={`nav-item ${isActive('/units')}`}>
          <Link to="/units" className="nav-link">Units</Link>
        </li>
        <li className={`nav-item ${isActive('/tenants')}`}>
          <Link to="/tenants" className="nav-link">Tenants</Link>
        </li>
        <li className={`nav-item ${isActive('/rent-payments')}`}>
          <Link to="/rent-payments" className="nav-link">Rent Payments</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;