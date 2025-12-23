import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUsers, FaHandshake, FaSignOutAlt, 
  FaHome, FaEnvelopeOpenText, 
  FaPlusCircle, FaUserFriends, FaTicketAlt, FaExternalLinkAlt,
  FaCameraRetro, FaBriefcase
} from 'react-icons/fa';
import { MdDashboardCustomize, MdEventAvailable } from 'react-icons/md';
import { 
  XAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar 
} from 'recharts';
import '../../style/adminpages/Dashboard.css';

// Sample Data for Charts
const registrationData = [
  { event: 'Gala', attendees: 120 },
  { event: 'Seminar', attendees: 85 },
  { event: 'Social', attendees: 200 },
  { event: 'Other', attendees: 50 },
];

const memberGrowthData = [
  { month: 'Oct', count: 45 },
  { month: 'Nov', count: 120 },
  { month: 'Dec', count: 210 },
  { month: 'Jan', count: 350 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0, sponsors: 0, liveEvents: 0, totalRaised: 0, messages: 0, helpedStudents: 0
  });

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
        console.error("Dashboard Stats Fetch Error:", err); 
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

  if (loading) return <div className="admin-loading-screen">Authenticating Command Center...</div>;

  return (
    <div className="admin-viewport">
      {/* SIDEBAR PANEL (ASH) */}
      <aside className="admin-sidebar">
        <div className="sidebar-top-section">
          {/* TIGER ORANGE HOME LINK */}
          <Link to="/" className="website-link go-ubsa-home">
            <FaExternalLinkAlt /> <span>Go UBSA Home</span>
          </Link>
          
          <div className="sidebar-brand">
            <MdDashboardCustomize /> <span>ADMIN PANEL</span>
          </div>

          <nav className="sidebar-nav">
            {/* FULL WIDTH FILL ACTIVE BUTTON */}
            <button onClick={() => window.location.reload()} className="nav-item active">
              <FaHome /> Dashboard
            </button>
            <Link to="/admin/members" className="nav-item"><FaUsers /> Members</Link>
            <Link to="/admin/event-tracking" className="nav-item"><MdEventAvailable /> Events</Link>
            <Link to="/admin/manage-sponsors" className="nav-item"><FaHandshake /> Sponsors</Link>
            <Link to="/admin/inbox" className="nav-item"><FaEnvelopeOpenText /> Inbox</Link>
          </nav>
        </div>

        {/* ISOLATED LOGOUT BUTTON */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="welcome-text">
            <h1>Command Center</h1>
            <p>Academic Session 2025-2026</p>
          </div>

          {/* TOP RIGHT ACTIONS (INBOX MOST RIGHT) */}
          <div className="top-right-actions">
            <Link to="/admin/inbox" className="header-action-btn inbox-btn">
               <FaEnvelopeOpenText />
               {stats.messages > 0 && <span className="inbox-badge">{stats.messages}</span>}
            </Link>
            <Link to="/admin/add-event" className="header-action-btn add-btn event-green">
              <FaPlusCircle /> Add Event
            </Link>
          </div>
        </header>

        {/* COLOR CODED STATS CARDS */}
        <section className="dashboard-stats-row">
          <Link to="/admin/event-tracking" className="mini-stat event-green">
            <span className="label">Live Events</span>
            <span className="value">{stats.liveEvents}</span>
          </Link>
          <Link to="/admin/members" className="mini-stat member-red">
            <span className="label">Member Count</span>
            <span className="value">{stats.members}</span>
          </Link>
          <Link to="/admin/manage-sponsors" className="mini-stat sponsor-orange">
            <span className="label">Sponsors</span>
            <span className="value">{stats.sponsors}</span>
          </Link>
          <Link to="/admin/inbox" className="mini-stat student-blue">
            <span className="label">Helped Students</span>
            <span className="value">{stats.helpedStudents}</span>
          </Link>
        </section>

        {/* MIDDLE SECTION: 2 SQUARE GRAPHS + SYSTEM OVERVIEW */}
        <section className="dashboard-middle-grid">
          <div className="chart-card square">
            <h3><FaUserFriends /> Member Growth</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#f5f5f3'}} />
                <Area type="monotone" dataKey="count" stroke="#ff4d4d" fill="url(#colorRed)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card square">
            <h3><FaTicketAlt /> Registrations</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={registrationData}>
                <XAxis dataKey="event" stroke="#f5f5f3" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#252525'}} contentStyle={{backgroundColor: '#1a1a1a', border: 'none', color: '#f5f5f3'}} />
                <Bar dataKey="attendees" fill="#f5f5f3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FIXED SYSTEM OVERVIEW (CONTENT FITTED) */}
          <div className="chart-card system-utility">
            <h3><MdDashboardCustomize /> System Overview</h3>
            <div className="utility-list">
                <div className="util-item"><span>Server Status</span><span className="status-dot online">Online</span></div>
                <div className="util-item"><span>Database</span><span className="status-dot online">Connected</span></div>
                <div className="util-item"><span>Inbox Alert</span><span className="count-tag">{stats.messages}</span></div>
                <div className="util-item"><span>Admin Uptime</span><span>99.98%</span></div>
                <div className="util-item"><span>Session</span><span>Active</span></div>
            </div>
          </div>
        </section>

        {/* BOTTOM QUICK ACTIONS FOOTER */}
        <footer className="dashboard-quick-actions">
           <Link to="/admin/manage-gallery" className="quick-btn"><FaCameraRetro /> Add Photo</Link>
           <Link to="/admin/manage-sponsors" className="quick-btn"><FaBriefcase /> Sponsors</Link>
           <Link to="/admin/add-event" className="quick-btn event-green"><FaPlusCircle /> Add Event</Link>
        </footer>
      </main>
    </div>
  );
}