import React, { useState } from 'react';
import nielitLogo from '../assets/logo.png';
import userLogo from '../assets/user.jpg';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ children, isMenuOpen, setIsMenuOpen}) => {
  

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <button 
          style={menuButtonStyle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <img src={nielitLogo} alt="NIELIT Logo" style={logoStyle} />
      </div>
      
      <div style={{ ...navContainerStyle, display: isMenuOpen ? 'block' : 'none' }}>
        {children}
      </div>
      
      <div style={userContainerStyle}>
        <img src={userLogo} alt="User" style={userLogoStyle} />
      </div>
    </header>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: '0', 
  zIndex: 1000,
  width: '100%',
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const menuButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
};

const navContainerStyle = {
  position: 'absolute',
  top: '100%',
  left: '0',
  width: '100%',
  backgroundColor: '#f8f9fa',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  zIndex: '1000',
  padding: '10px',
};

const logoStyle = {
  height: '60px',
  width: '1200px',
};

const userContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const userLogoStyle = {
  height: '40px',
  width: '40px',
  borderRadius: '50%',
};

export default Header;