import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import '../../style/adminpages/Login.css'; 

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // On mount, check if a session exists; otherwise, ensure clean slate
  useEffect(() => {
    if (sessionStorage.getItem('adminToken') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Security check against the master key
    if (password === 'tiger2025') {
      sessionStorage.setItem('adminToken', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(true);
      // Reset shake animation after 2 seconds
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="admin-login-viewport">
      <div className={`login-central-card ${error ? 'shake' : ''}`}>
        
        {/* BRANDING SECTION */}
        <div className="login-branding">
          <div className="shield-icon-wrapper">
            <FaShieldAlt />
          </div>
          <h1>COMMAND <span>CENTER</span></h1>
          <p>UBSA Restricted Access</p>
        </div>

        {/* AUTHORIZATION FORM */}
        <form onSubmit={handleLogin} className="login-form-container">
          <div className="password-field-wrapper">
            <FaLock className="field-icon" />
            <input 
              type="password" 
              placeholder="ENTER ACCESS KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <button type="submit" className="login-auth-btn">
            Authorize Entry
          </button>
        </form>

        {/* FEEDBACK & NAVIGATION */}
        {error ? (
          <div className="error-badge">Access Denied: Invalid Key</div>
        ) : (
          <Link to="/" className="back-to-site-link">
            <FaArrowLeft /> Return to Public Website
          </Link>
        )}
      </div>
    </div>
  );
}