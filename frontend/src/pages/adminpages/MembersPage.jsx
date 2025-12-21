import React, { useState, useEffect } from 'react';
import { FaSearch, FaEnvelope, FaTrash, FaCheckCircle, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../../style/adminpages/Dashboard.css';

const COLORS = ['#e36f04', '#004f26', '#2196f3', '#ffd700', '#9c27b0', '#ff5252'];

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('http://localhost:5000/api/members');
    const data = await res.json();
    setMembers(data);
  };

  // --- DATA PROCESSING FOR CHART ---
  const getDeptData = () => {
    const counts = {};
    members.forEach(m => {
      counts[m.department] = (counts[m.department] || 0) + 1;
    });
    return Object.keys(counts).map(dept => ({ name: dept, value: counts[dept] }));
  };

  // --- SEARCH & FILTER ---
  const filteredMembers = members.filter(m => 
    `${m.first_name} ${m.last_name} ${m.student_id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- BROADCAST LOGIC ---
  const handleBroadcast = () => {
    const target = selectedMembers.length > 0 ? `${selectedMembers.length} selected members` : "ALL members";
    if (window.confirm(`Send a broadcast email to ${target}?`)) {
      // Trigger your backend broadcast route here
      alert("Broadcast initiated!");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1><FaUsers /> Member <span className="text-highlight">Directory</span></h1>
        <button className="broadcast-btn" onClick={handleBroadcast}>
          <FaEnvelope /> Send Broadcast
        </button>
      </div>

      {/* DEPARTMENT CHART SECTION */}
      <div className="glass chart-section">
        <h3><FaChartPie /> Department Distribution</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie 
                data={getDeptData()} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
              >
                {getDeptData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search by name or Student ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* MEMBERS TABLE */}
      <div className="glass table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(m => (
              <tr key={m.id}>
                <td>
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedMembers([...selectedMembers, m.email]);
                      else setSelectedMembers(selectedMembers.filter(email => email !== m.email));
                    }}
                  />
                </td>
                <td>{m.first_name} {m.last_name}</td>
                <td>{m.department}</td>
                <td><span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                <td className="action-btns">
                  <button className="verify-btn"><FaCheckCircle /></button>
                  <button className="delete-btn"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}