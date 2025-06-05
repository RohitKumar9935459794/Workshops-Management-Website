import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab,  className  }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-brand">Workshop Management</div>
      
      <ul className="navbar-nav">
        <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
          <Link to="/dashboard" onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </Link>
        </li>
        <li className={`nav-item ${activeTab === 'add-workshop' ? 'active' : ''}`}>
          <Link to="/add-workshop" onClick={() => setActiveTab('add-workshop')}>
            Add new Workshop
          </Link>
        </li>
        <li className={`nav-item ${activeTab === 'workshops' ? 'active' : ''}`}>
          <Link to="/workshops" onClick={() => setActiveTab('workshops')}>
            Get Workshop Reports
          </Link>
        </li>
        
        <li className={`nav-item ${activeTab === 'participants' ? 'active' : ''}`}>
          <Link to="/participant-reports" onClick={() => setActiveTab('participants')}>
            Get Participant Reports
          </Link>
        </li>
      </ul>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;

