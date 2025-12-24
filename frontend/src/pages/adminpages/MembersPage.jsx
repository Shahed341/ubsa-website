import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaEnvelope, FaTrash, FaUsers, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../../style/adminpages/Memberpage.css';

// Professional Dashboard Color Palette
const COLORS = ['#FF8C00', '#FF4D4D', '#2ECC71', '#3498DB', '#9C27B0', '#F39C12'];

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/members');
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this member from the database?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMembers();
    } catch (err) {
      alert("Delete failed. Please check server connection.");
    }
  };

  // Memoize Department Data for performance and Recharts stability
  const deptData = useMemo(() => {
    if (!members.length) return [];
    const counts = {};
    members.forEach(m => {
      const dept = m.department || "Unspecified";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map(dept => ({
      name: dept,
      value: counts[dept]
    }));
  }, [members]);

  const filteredMembers = members.filter(m =>
    `${m.first_name} ${m.last_name} ${m.student_id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleBroadcast = () => {
    if (selectedEmails.length === 0) return alert("Please select at least one member.");
    if (window.confirm(`Launch broadcast to ${selectedEmails.length} members?`)) {
      alert(`Broadcast successful for: ${selectedEmails.length} recipients.`);
      setSelectedEmails([]);
    }
  };

  if (loading) return <div className="admin-loading">Initializing Directory...</div>;

  return (
    <div className="members-integrated-view">
      {/* 1. HEADER SECTION - Compact and Split */}
      <div className="members-page-header">
        <div className="header-text">
          <h2><FaUsers /> Member Directory</h2>
          <p>UBSA Database Session 2025-2026</p>
        </div>
        
        {/* COMPACT TOP-RIGHT BUTTON */}
        <button className="broadcast-action-btn" onClick={handleBroadcast}>
          <FaEnvelope /> Broadcast ({selectedEmails.length})
        </button>
      </div>

      {/* 2. TOP GRID: STATS & SEARCH */}
      <div className="members-top-grid">
        <div className="glass-card chart-container-card">
          <h3 className="chart-title"><FaChartPie /> Department Distribution</h3>
          <div className="integrated-pie-container" style={{ height: '220px' }}>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#121212', border: '1px solid #FF8C00', borderRadius: '10px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-msg">Waiting for data...</div>
            )}
          </div>
        </div>

        <div className="glass-card search-filter-card">
          <h3><FaSearch /> Search Filters</h3>
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Name, ID, or NSID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-hint">
             Found: <strong>{filteredMembers.length} Members</strong>
          </div>
        </div>
      </div>

      {/* 3. TABLE SECTION - Internal Scroll */}
      <div className="members-table-viewport">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Select</th>
              <th>Full Name</th>
              <th>Student ID</th>
              <th>Department</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(m => (
              <tr key={m.id} className={selectedEmails.includes(m.email) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    className="member-checkbox"
                    checked={selectedEmails.includes(m.email)}
                    onChange={() => toggleSelect(m.email)}
                  />
                </td>
                <td className="member-name-cell">{m.first_name} {m.last_name}</td>
                <td><code className="id-code">{m.student_id}</code></td>
                <td><span className="dept-tag">{m.department || "General"}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <button className="delete-row-btn" onClick={() => handleDelete(m.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="no-results">No members match your search criteria.</div>
        )}
      </div>
    </div>
  );
}