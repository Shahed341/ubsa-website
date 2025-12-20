import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for mobile menu
import logo from '../assets/UBSA_Logo.png'; 
import '../style/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="ubsa-navbar">
      <div className="nav-container">
        
        {/* --- LEFT: Logo --- */}
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img src={logo} alt="UBSA Logo" className="logo-img" />
          </Link>
        </div>

        {/* --- CENTER: Desktop Menu --- */}
        <nav className="nav-menu-desktop">
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
          <Link to="/events" className={`nav-link ${isActive('/events')}`}>Events</Link>
          <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>Gallery</Link>
          <Link to="/sponsors" className={`nav-link ${isActive('/sponsors')}`}>Sponsors</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
        </nav>

        {/* --- RIGHT: Actions --- */}
        <div className="nav-right">
          {/* Member+ Button */}
          <a href="mailto:ubsa.usask@gmail.com" className="btn-member">
            Member<span className="plus">+</span>
          </a>

          {/* Mobile Hamburger Icon */}
          <div className="mobile-toggle" onClick={toggleMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/events" onClick={closeMenu}>Events</Link>
        <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
        <Link to="/sponsors" onClick={closeMenu}>Sponsors</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>

    </header>
  );
}