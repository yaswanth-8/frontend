import React from 'react';

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <small>&copy; {currentYear} Simply Yaswanth. All rights reserved.</small>
    </footer>
  );
};

export default Footer;
