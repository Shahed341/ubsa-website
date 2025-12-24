import React, { useState } from 'react';
import { FaTools, FaDatabase, FaGlobe, FaShieldAlt, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import '../../style/adminpages/Settings.css';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'UBSA Official',
    contactEmail: 'info@ubsa.com',
    maintenanceMode: false,
    registrationOpen: true,
    dbBackupFreq: 'Daily'
  });

  const [status, setStatus] = useState({
    server: 'Stable',
    database: 'Connected',
    uptime: '99.9%'
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const saveSettings = () => {
    alert("Configuration pushed to production server!");
  };

  return (
    <div className="settings-integrated-view">
      {/* HEADER */}
      <div className="settings-page-header">
        <div className="header-text">
          <h2><FaTools /> System Settings</h2>
          <p>Configure the global engine and security protocols of the UBSA platform.</p>
        </div>
        <button className="global-save-btn" onClick={saveSettings}>
          <FaSave /> Save Changes
        </button>
      </div>

      <div className="settings-grid">
        {/* LEFT COLUMN: SYSTEM HEALTH */}
        <div className="settings-column">
          <div className="settings-card glass-effect">
            <h3><FaDatabase /> Engine Health</h3>
            <div className="status-list">
              <div className="status-item">
                <span>Server Status</span>
                <span className="status-indicator online">{status.server}</span>
              </div>
              <div className="status-item">
                <span>Database Sync</span>
                <span className="status-indicator online">{status.database}</span>
              </div>
              <div className="status-item">
                <span>Uptime History</span>
                <span className="status-value">{status.uptime}</span>
              </div>
            </div>
          </div>

          <div className="settings-card glass-effect warning-zone">
            <h3><FaExclamationTriangle /> Critical Actions</h3>
            <p className="zone-desc">These actions affect the live user experience.</p>
            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Maintenance Mode</strong>
                <span>Redirects all public traffic to a splash screen.</span>
              </div>
              <button 
                className={`toggle-switch ${settings.maintenanceMode ? 'on' : ''}`}
                onClick={() => handleToggle('maintenanceMode')}
              >
                <div className="switch-handle"></div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION */}
        <div className="settings-column">
          <div className="settings-card glass-effect">
            <h3><FaGlobe /> Public Configuration</h3>
            <div className="input-group-stack">
              <label>Official Contact Email</label>
              <input 
                type="email" 
                value={settings.contactEmail} 
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
              
              <label>Database Backup Frequency</label>
              <select 
                value={settings.dbBackupFreq} 
                onChange={(e) => setSettings({...settings, dbBackupFreq: e.target.value})}
              >
                <option>Hourly</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="settings-card glass-effect">
            <h3><FaShieldAlt /> Security Protocol</h3>
            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Allow New Registrations</strong>
                <span>Enable/Disable the public sign-up form.</span>
              </div>
              <button 
                className={`toggle-switch ${settings.registrationOpen ? 'on' : ''}`}
                onClick={() => handleToggle('registrationOpen')}
              >
                <div className="switch-handle"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}