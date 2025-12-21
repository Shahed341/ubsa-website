import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUsers, FaHandshake, FaMoneyBillWave, FaCalendarPlus, 
  FaImages, FaCog, FaSignOutAlt, FaChartLine, FaHistory 
} from 'react-icons/fa';
import { MdDashboardCustomize, MdOutlineLibraryAdd } from 'react-icons/md';
import '../../style/adminpages/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    sponsors: 0,
    events: 0
  });

  useEffect(() => {
    // Auth Guard
    if (localStorage.getItem('adminToken') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const urls = [
        'http://localhost:5000/api/members',
        'http://localhost:5000/api/sponsor-applications',
        'http://localhost:5000/api/events'
      ];

      const [members, sponsors, events] = await Promise.all(
        urls.map(url => fetch(url).then(res => res.json()))
      );

      setStats({
        members: members.length,
        sponsors: sponsors.length,
        events: events.length
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="admin-loading">Accessing UBSA Systems...</div>;

  return (
    <div className="dashboard-container">
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="header-text">
          <h1>
            <MdDashboardCustomize className="header-icon-main" /> 
            Admin <span className="text-highlight">Control</span>
          </h1>
          <p>UBSA Management System | Academic Session 2025-2026</p>
        </div>
        <button className="logout-pill" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* STATS STRIP - Members is now a clickable Link */}
      <div className="stats-grid">
        <Link to="/admin/members" className="stat-card glass orange-glow" style={{ textDecoration: 'none' }}>
          <div className="stat-icon-wrapper"><FaUsers /></div>
          <div className="stat-info">
            <h3>Total Members</h3>
            <p className="stat-number">{stats.members}</p>
            <span className="click-hint">View Directory →</span>
          </div>
        </Link>

        <div className="stat-card glass green-glow">
          <div className="stat-icon-wrapper"><FaMoneyBillWave /></div>
          <div className="stat-info">
            <h3>Treasury</h3>
            <p className="stat-number">${stats.members * 5}</p>
          </div>
        </div>

        <div className="stat-card glass gold-glow">
          <div className="stat-icon-wrapper"><FaHandshake /></div>
          <div className="stat-info">
            <h3>Sponsors</h3>
            <p className="stat-number">{stats.sponsors}</p>
          </div>
        </div>
      </div>

      {/* MANAGEMENT TOOLS */}
      <h2 className="section-title"><FaChartLine /> Management Tools</h2>
      <div className="actions-grid">
        <Link to="/admin/add-event" className="action-card glass-hover">
          <MdOutlineLibraryAdd className="action-icon-premium" />
          <h3>New Event</h3>
          <p>Schedule programs or gala nights.</p>
        </Link>

        <Link to="/admin/manage-gallery" className="action-card glass-hover">
          <FaImages className="action-icon-premium" />
          <h3>Photo Hub</h3>
          <p>Update gallery and albums.</p>
        </Link>

        <Link to="/admin/setup-committee" className="action-card glass-hover danger-btn">
          <FaHistory className="action-icon-premium" />
          <h3>Reset Committee</h3>
          <p>Archive and setup new executives.</p>
        </Link>

        <div className="action-card glass-hover disabled">
          <FaCog className="action-icon-premium" />
          <h3>Settings</h3>
          <p>Global site configuration.</p>
        </div>
      </div>
    </div>
  );
}