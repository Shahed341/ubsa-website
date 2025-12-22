import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHandshake, FaArrowLeft, FaCheck, FaTrash, 
  FaInfoCircle, FaMapMarkerAlt, FaSearch, FaTimes, FaEnvelope 
} from 'react-icons/fa';
import '../../style/adminpages/Dashboard.css';
import '../../style/adminpages/ManageSponsors.css';

export default function ManageSponsors() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // For Detail Modal

  useEffect(() => { fetchApps(); }, []);

  useEffect(() => {
    const results = apps.filter(app =>
      app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApps(results);
  }, [searchTerm, apps]);

  const fetchApps = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sponsors/applications');
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this sponsor? This will move them to the public website.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sponsors/approve/${id}`, { method: 'POST' });
      if (res.ok) {
        alert("Sponsor approved successfully!");
        setSelectedApp(null);
        fetchApps();
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (err) { alert("Server connection error."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this application?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sponsors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedApp(null);
        fetchApps();
      }
    } catch (err) { alert("Delete failed"); }
  };

  // --- DETAIL MODAL COMPONENT ---
  const DetailModal = ({ app, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass detail-card-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <div className="modal-header">
          <span className={`dept-tag tier-${app.tier?.toLowerCase()}`}>{app.tier} Tier</span>
          <h2>{app.business_name}</h2>
          <p><FaMapMarkerAlt /> {app.location}</p>
        </div>
        <hr className="divider" />
        <div className="modal-body">
          <div className="info-section">
            <h4><FaInfoCircle /> Business Description</h4>
            <p>{app.description || "No description provided."}</p>
          </div>
          <div className="info-grid">
            <div>
              <label>Contact Email</label>
              <p><FaEnvelope /> {app.email}</p>
            </div>
            <div>
              <label>Payment Method</label>
              <p>{app.payment_type}</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {app.status !== 'Approved' && (
            <button className="verify-btn-large" onClick={() => handleApprove(app.id)}>
              <FaCheck /> Approve & Publish
            </button>
          )}
          <button className="delete-btn-text" onClick={() => handleDelete(app.id)}>
            <FaTrash /> Delete Application
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-text">
          <h1><FaHandshake className="header-icon-main" /> Sponsor <span className="text-highlight">Portal</span></h1>
          <p>Review partnership inquiries and manage active sponsors.</p>
        </div>
        <button className="logout-pill" onClick={() => navigate('/admin/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search business name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business Details</th>
              <th>Location</th>
              <th>Tier</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id}>
                <td>
                  <div className="business-cell">
                    <strong>{app.business_name}</strong>
                    <span>{app.email}</span>
                  </div>
                </td>
                <td>
                  <div className="location-cell">
                    <FaMapMarkerAlt /> {app.location || 'N/A'}
                  </div>
                </td>
                <td><span className={`dept-tag tier-${app.tier?.toLowerCase()}`}>{app.tier}</span></td>
                <td>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td className="action-btns">
                  <button className="info-btn" onClick={() => setSelectedApp(app)}>
                    <FaInfoCircle /> Details
                  </button>
                  {app.status !== 'Approved' && (
                    <button className="verify-btn" onClick={() => handleApprove(app.id)}>
                      <FaCheck />
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleDelete(app.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!loading && filteredApps.length === 0 && (
          <div className="empty-state">
            <p>No applications found.</p>
          </div>
        )}
      </div>

      {selectedApp && <DetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </div>
  );
}