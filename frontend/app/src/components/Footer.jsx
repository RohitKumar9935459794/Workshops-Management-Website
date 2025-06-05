import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>
        © {currentYear} Designed & Developed by NIELIT WBL-Cohort 6 Interns 
      </p>
    </footer>
  );
};

// Styles
const footerStyle = {
  backgroundColor: '#343a40',
  color: 'white',
  textAlign: 'center',
  padding: '15px 0',
  width: '100%',
    position: 'sticky',
  top: '0', 
  zIndex: 1000,
};

const textStyle = {
  margin: '0',
  fontSize: '14px',
};

export default Footer;