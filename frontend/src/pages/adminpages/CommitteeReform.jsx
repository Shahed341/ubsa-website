import React, { useState, useEffect } from 'react';
import { FaSitemap, FaUserShield, FaSave, FaUserPlus, FaTrash } from 'react-icons/fa';
import '../../style/adminpages/Committee.css';

export default function CommitteeReform() {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCommittee();
  }, []);

  const fetchCommittee = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/committee');
      const data = await res.json();
      setCommittee(data);
    } catch (err) {
      console.error("Failed to load committee");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (id, newRole) => {
    const updated = committee.map(m => m.id === id ? { ...m, role: newRole } : m);
    setCommittee(updated);
  };

  const saveChanges = async (member) => {
    try {
      const res = await fetch(`http://localhost:5000/api/committee/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: member.role, rank: member.rank })
      });
      if (res.ok) setMessage(`Updated ${member.name} successfully!`);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="admin-loading">Mapping Organization...</div>;

  return (
    <div className="committee-integrated-view">
      <div className="committee-page-header">
        <div className="header-text">
          <h2><FaSitemap /> Committee Reform</h2>
          <p>Restructure the executive board and manage access levels.</p>
        </div>
        <button className="add-exec-btn"><FaUserPlus /> Appoint Member</button>
      </div>

      {message && <div className="status-msg-mini">{message}</div>}

      <div className="committee-grid">
        {committee.map((member) => (
          <div key={member.id} className="exec-card">
            <div className="exec-avatar">
              <FaUserShield />
            </div>
            <div className="exec-info">
              <h4>{member.first_name} {member.last_name}</h4>
              <input 
                type="text" 
                className="role-input" 
                value={member.role} 
                onChange={(e) => handleRoleUpdate(member.id, e.target.value)}
              />
              <span className="exec-email">{member.email}</span>
            </div>
            <div className="exec-actions">
              <button className="save-exec-btn" onClick={() => saveChanges(member)}>
                <FaSave />
              </button>
              <button className="remove-exec-btn">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  );
}