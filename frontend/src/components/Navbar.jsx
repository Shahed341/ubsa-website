import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/UBSA_Logo.png'; 
import '../style/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="ubsa-navbar">
      <div className="nav-container">
        
        {/* Logo acting as the Home Button */}
        <Link to="/" className="nav-logo" aria-label="Return to Home">
          <img 
            src={logo} 
            alt="UBSA Home" 
            className="logo-img" 
          />
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>
            About
          </Link>
          <Link to="/events" className={`nav-link ${isActive('/events')}`}>
            Events
          </Link>
          <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>
            Gallery
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
            Contact
          </Link>
        </nav>

        {/* Join Button */}
        <div className="nav-cta">
          <a href="mailto:ubsa.usask@gmail.com" className="btn-join">
            Join Us
          </a>
        </div>

      </div>
    </header>
  );
}