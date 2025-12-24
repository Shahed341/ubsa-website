import React, { useState, useEffect } from 'react';
import { 
  FaHandshake, FaCheck, FaTrash, 
  FaInfoCircle, FaMapMarkerAlt, FaSearch, FaTimes, FaEnvelope 
} from 'react-icons/fa';
import '../../style/adminpages/ManageSponsors.css';

export default function ManageSponsors() {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

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
      setApps(Array.isArray(data) ? data : []);
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

  if (loading) return <div className="admin-loading">Loading Sponsor Data...</div>;

  return (
    <div className="sponsors-integrated-view">
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="header-text">
          <h1><FaHandshake className="header-icon-main" /> Sponsor <span className="text-highlight">Portal</span></h1>
          <p>Review partnership inquiries and manage active sponsors.</p>
        </div>
      </div>

      {/* TOP ACTION BAR */}
      <div className="sponsors-top-grid">
        <div className="glass-card search-filter-card">
          <h3><FaSearch /> Filter Applications</h3>
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search business name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="search-hint">Tip: Use the info button to view business descriptions and payment methods.</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business Details</th>
              <th>Location</th>
              <th>Tier</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
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
        {filteredApps.length === 0 && <div className="empty-state">No applications found.</div>}
      </div>

      {/* MODAL SYSTEM */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="detail-card-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedApp(null)}><FaTimes /></button>
            <div className="modal-header">
              <span className={`dept-tag tier-${selectedApp.tier?.toLowerCase()}`}>{selectedApp.tier} Tier</span>
              <h2>{selectedApp.business_name}</h2>
              <p><FaMapMarkerAlt /> {selectedApp.location}</p>
            </div>
            <div className="modal-body">
              <div className="info-section">
                <h4><FaInfoCircle /> Description</h4>
                <p>{selectedApp.description || "No description provided."}</p>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Contact</label>
                  <p><FaEnvelope /> {selectedApp.email}</p>
                </div>
                <div className="info-item">
                  <label>Method</label>
                  <p>{selectedApp.payment_type}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedApp.status !== 'Approved' && (
                <button className="broadcast-action-btn" onClick={() => handleApprove(selectedApp.id)}>
                  <FaCheck /> Approve & Publish
                </button>
              )}
              <button className="delete-row-btn" onClick={() => handleDelete(selectedApp.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}