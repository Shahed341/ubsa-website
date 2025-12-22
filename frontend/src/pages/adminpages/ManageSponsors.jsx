import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHandshake, FaArrowLeft, FaCheck, FaTrash, FaBusinessTime } from 'react-icons/fa';
import '../../style/adminpages/Dashboard.css';

export default function ManageSponsors() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sponsors');
      const data = await res.json();
      setApps(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sponsors/approve/${id}`, { method: 'POST' });
      if (res.ok) {
        alert("Sponsor approved! They are now visible on the public Sponsors page.");
        fetchApps();
      }
    } catch (err) { alert("Approval failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this application?")) return;
    try {
      await fetch(`http://localhost:5000/api/sponsors/${id}`, { method: 'DELETE' });
      fetchApps();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-text">
          <h1><FaHandshake className="header-icon-main" /> Sponsor <span className="text-highlight">Portal</span></h1>
          <p>Review partnership inquiries and manage active sponsors.</p>
        </div>
        <button className="logout-pill" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={() => navigate('/admin/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <div className="glass table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Requested Tier</th>
              <th>Payment Info</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td style={{fontWeight: '600'}}>{app.business_name}</td>
                <td><span className="dept-tag">{app.tier}</span></td>
                <td>{app.payment_type}</td>
                <td>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td className="action-btns" style={{justifyContent: 'center'}}>
                  {app.status !== 'Approved' && (
                    <button className="verify-btn" title="Approve Sponsor" onClick={() => handleApprove(app.id)}>
                      <FaCheck />
                    </button>
                  )}
                  <button className="delete-btn" title="Delete Application" onClick={() => handleDelete(app.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && apps.length === 0 && (
          <p style={{textAlign: 'center', padding: '2rem', opacity: 0.5}}>No sponsor applications found.</p>
        )}
      </div>
    </div>
  );
}