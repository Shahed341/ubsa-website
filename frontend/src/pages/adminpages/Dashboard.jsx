import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import { 
  FaUsers, FaHandshake, FaSignOutAlt, 
  FaHome, FaEnvelopeOpenText, 
  FaPlusCircle, FaUserFriends, FaTicketAlt, FaExternalLinkAlt,
  FaCameraRetro, FaBriefcase, FaSitemap, FaTools
} from 'react-icons/fa';
import { MdDashboardCustomize, MdCollections } from 'react-icons/md';
import { 
  XAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar 
} from 'recharts';

// Sub-Component Imports
import MembersPage from './MembersPage';
import Inbox from './Inbox';
import ManageSponsors from './ManageSponsors';
import AddEvent from './AddEvent';
import ManageGallery from './ManageGallery';
import CommitteeReform from './CommitteeReform'; // Newly Linked
import SystemSettings from './SystemSettings';   // Newly Linked

import '../../style/adminpages/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0, sponsors: 0, liveEvents: 0, messages: 0, helpedStudents: 0
  });

  const isBaseDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/';

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [members, sponsors, events, messages] = await Promise.all([
          fetch('http://localhost:5000/api/members').then(res => res.json()),
          fetch('http://localhost:5000/api/sponsors').then(res => res.json()),
          fetch('http://localhost:5000/api/events').then(res => res.json()),
          fetch('http://localhost:5000/api/contact-messages').then(res => res.json())
        ]);

        const now = new Date();
        setStats({
          members: Array.isArray(members) ? members.length : 0,
          sponsors: Array.isArray(sponsors) ? sponsors.length : 0,
          liveEvents: Array.isArray(events) ? events.filter(e => new Date(e.date) >= now).length : 0,
          messages: Array.isArray(messages) ? messages.filter(m => m.status === 'unread').length : 0,
          helpedStudents: Array.isArray(messages) ? messages.filter(m => m.status === 'resolved').length : 0
        });
      } catch (err) { 
        console.error("Dashboard Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    
    if (localStorage.getItem('adminToken') === 'true') {
        fetchDashboardStats();
    } else {
        navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/', { replace: true });
  };

  if (loading) return (
    <div className="admin-loading-screen">
      <div className="loader-pulse"></div>
      <span>AUTHENTICATING COMMAND CENTER...</span>
    </div>
  );

  return (
    <div className="admin-viewport">
      {/* --- 1. SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span>UBSA</span>
        </div>

        <Link to="/" className="go-ubsa-home">
          <FaExternalLinkAlt /> <span>Public Site</span>
        </Link>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Core</div>
          <Link to="/admin/dashboard" className={`nav-item ${isBaseDashboard ? 'active' : ''}`}>
            <FaHome /> <span>Overview</span>
          </Link>
          <Link to="/admin/dashboard/inbox" className={`nav-item ${location.pathname.includes('inbox') ? 'active' : ''}`}>
            <FaEnvelopeOpenText /> <span>Inbox</span>
            {stats.messages > 0 && <span className="nav-badge">{stats.messages}</span>}
          </Link>

          <div className="nav-group-label">Management</div>
          <Link to="/admin/dashboard/members" className={`nav-item ${location.pathname.includes('members') ? 'active' : ''}`}>
            <FaUsers /> <span>Members</span>
          </Link>
          <Link to="/admin/dashboard/sponsors" className={`nav-item ${location.pathname.includes('sponsors') ? 'active' : ''}`}>
            <FaHandshake /> <span>Sponsors</span>
          </Link>
          
          <div className="nav-group-label">Content</div>
          <Link to="/admin/dashboard/add-event" className={`nav-item ${location.pathname.includes('add-event') ? 'active' : ''}`}>
            <FaPlusCircle /> <span>Add Event</span>
          </Link>
          <Link to="/admin/dashboard/gallery" className={`nav-item ${location.pathname.includes('gallery') ? 'active' : ''}`}>
            <MdCollections /> <span>Manage Gallery</span>
          </Link>

          <div className="nav-group-label">Organization</div>
          <Link to="/admin/dashboard/committee" className={`nav-item ${location.pathname.includes('committee') ? 'active' : ''}`}>
            <FaSitemap /> <span>Committee Reform</span>
          </Link>
          <Link to="/admin/dashboard/settings" className={`nav-item ${location.pathname.includes('settings') ? 'active' : ''}`}>
            <FaTools /> <span>System Settings</span>
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      {/* --- 2. MAIN PANEL --- */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="welcome-text">
            <h1>Command Center</h1>
            <p>Admin Control Panel • Academic Session 2025</p>
          </div>

          <div className="top-right-actions">
            <Link to="/admin/dashboard/inbox" className="header-action-btn inbox-btn">
              <FaEnvelopeOpenText />
              {stats.messages > 0 && <span className="inbox-badge">{stats.messages}</span>}
            </Link>
          </div>
        </header>

        {/* --- 3. DYNAMIC CONTENT AREA --- */}
        <div className="dashboard-scroll-container">
          <Routes>
            <Route index element={<OverviewGrid stats={stats} />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="sponsors" element={<ManageSponsors />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="gallery" element={<ManageGallery />} />
            
            {/* FULLY LINKED MODULES */}
            <Route path="committee" element={<CommitteeReform />} />
            <Route path="settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

/**
 * OverviewGrid Component
 * Renders the main dashboard statistics and charts
 */
function OverviewGrid({ stats }) {
  const memberGrowthData = [
    { month: 'Oct', count: 45 }, { month: 'Nov', count: 120 }, { month: 'Dec', count: 210 }, { month: 'Jan', count: 350 }
  ];

  const registrationData = [
    { event: 'Gala', attendees: 120 }, { event: 'Seminar', attendees: 85 },
    { event: 'Social', attendees: 200 }, { event: 'Other', attendees: 50 },
  ];

  return (
    <div className="overview-fill-wrapper">
      <section className="dashboard-stats-row">
        <Link to="/admin/dashboard/add-event" className="mini-stat event-green">
          <span className="label">Live Events</span>
          <span className="value">{stats.liveEvents}</span>
        </Link>
        <Link to="/admin/dashboard/members" className="mini-stat member-red">
          <span className="label">Member Count</span>
          <span className="value">{stats.members}</span>
        </Link>
        <Link to="/admin/dashboard/sponsors" className="mini-stat sponsor-orange">
          <span className="label">Sponsors</span>
          <span className="value">{stats.sponsors}</span>
        </Link>
        <div className="mini-stat student-blue">
          <span className="label">Helped Students</span>
          <span className="value">{stats.helpedStudents}</span>
        </div>
      </section>

      <section className="dashboard-middle-grid">
        <div className="chart-card">
          <h3><FaUserFriends /> Member Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={memberGrowthData}>
              <defs>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '10px', color: '#fff'}} />
              <Area type="monotone" dataKey="count" stroke="#ff4d4d" fill="url(#colorRed)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaTicketAlt /> Registrations</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrationData}>
              <XAxis dataKey="event" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '10px', color: '#fff'}} />
              <Bar dataKey="attendees" fill="#ff8c00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card system-utility">
          <h3><MdDashboardCustomize /> System Overview</h3>
          <div className="utility-list">
            <div className="util-item"><span>Server Status</span><span className="status-dot">Online</span></div>
            <div className="util-item"><span>Database</span><span className="status-dot">Connected</span></div>
            <div className="util-item"><span>Inbox Alert</span><span className="count-tag">{stats.messages} New</span></div>
            <div className="util-item"><span>API Health</span><span className="status-dot">Stable</span></div>
          </div>
        </div>
      </section>

      <footer className="dashboard-quick-actions">
          <Link to="/admin/dashboard/gallery" className="quick-btn"><FaCameraRetro /> Gallery</Link>
          <Link to="/admin/dashboard/sponsors" className="quick-btn"><FaBriefcase /> Sponsors</Link>
          <Link to="/admin/dashboard/add-event" className="quick-btn"><FaPlusCircle /> Add Event</Link>
      </footer>
    </div>
  );
}