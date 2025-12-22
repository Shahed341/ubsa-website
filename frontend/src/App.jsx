import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';
import About from './pages/About';
import Join from './pages/Join';

// --- ADMIN PAGES ---
import Login from './pages/adminpages/Login';
import Dashboard from './pages/adminpages/Dashboard';
import AddEvent from './pages/adminpages/AddEvent';
import ManageGallery from './pages/adminpages/ManageGallery';
import MembersPage from './pages/adminpages/MembersPage';
import SetupCommittee from './pages/adminpages/SetupCommittee'; // New Transition Page
import Inbox from './pages/adminpages/Inbox';

function App() {
  const location = useLocation();

  // Logic: Hides main Navbar/Footer from the Admin portal
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/join" element={<Join />} />

        {/* --- ADMIN AUTH ROUTES --- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* --- PROTECTED ADMIN ROUTES --- */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-event" element={<AddEvent />} />
          <Route path="/admin/manage-gallery" element={<ManageGallery />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/setup-committee" element={<SetupCommittee />} />
          <Route path="/admin/inbox" element={<Inbox />} />
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '150px 20px', color: 'white', background: '#000', minHeight: '100vh' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" style={{ color: '#e36f04', fontWeight: 'bold' }}>Return Home</a>
          </div>
        } />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;