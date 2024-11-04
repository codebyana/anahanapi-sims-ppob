// src/components/Dashboard/Header.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <NavLink to="/dashboard" className="logo-link" onClick={() => setMenuOpen(false)}>
        <div className="logo">
          <img src="/images/logoo.png" alt="Logo" />
          <span>SIMS PPOB</span>
        </div>
      </NavLink>
      <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/topup" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Top Up
        </NavLink>
        <NavLink to="/transaction" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Transaction
        </NavLink>
        <NavLink to="/account" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Account
        </NavLink>
      </nav>
      <div className="menu-icon" onClick={toggleMenu}>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </div>
    </header>
  );
};

export default Header;
