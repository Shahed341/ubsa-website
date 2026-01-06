import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Utilities
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; 
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';
import Join from './pages/Join';
import Constitution from './components/Constitution';
import GalleryVideo from './components/gallery/GalleryVideo';
import HomeInsta from './pages/Instagram/HomeInsta';

// --- ADMIN PAGES ---
import Login from './pages/adminpages/Login';
import Dashboard from './pages/adminpages/Dashboard';
import MembersPage from './pages/adminpages/MembersPage';
import Inbox from './pages/adminpages/Inbox';
import ManageSponsors from './pages/adminpages/ManageSponsors';
import AddEvent from './pages/adminpages/AddEvent';
import ManageGallery from './pages/adminpages/ManageGallery';
import ManageVideos from './pages/adminpages/ManageVideos'; 
import CommitteeReform from './pages/adminpages/CommitteeReform';
import SystemSettings from './pages/adminpages/SystemSettings';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // --- SECURITY GUARD: AUTO-LOGOUT ON LEAVE ---
  useEffect(() => {
    /** * If the user is on a public route, we clear the admin session.
     * This ensures that navigating away from the dashboard requires 
     * the access key to get back in.
     */
    if (!isAdminRoute && location.pathname !== '/admin/login') {
      sessionStorage.removeItem('adminToken');
    }
  }, [isAdminRoute, location.pathname]);

  return (
    <>
      {/* Resets scroll position to top on every route change */}
      <ScrollToTop />

      {/* Hide Public Navbar when inside any Admin route */}
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
        <Route path="/constitution" element={<Constitution />} />
        <Route path="/videos" element={<GalleryVideo />} />
        <Route path="/instagram" element={<HomeInsta />} />
        
        {/* --- ADMIN AUTHENTICATION --- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* --- PROTECTED ADMIN DASHBOARD SHELL --- */}
        <Route element={<ProtectedAdminRoute />}>
          {/* IMPORTANT: The "/*" is required because Dashboard contains 
              its own nested <Routes> component. Without it, sub-pages 
              like /dashboard/videos will fail to render.
          */}
          <Route path="/admin/dashboard/*" element={<Dashboard newsStyle={true} />}>
            {/* Default view when landing on dashboard */}
            <Route index element={<Navigate to="members" replace />} />
            
            {/* Dashboard Sub-routes */}
            <Route path="members" element={<MembersPage />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="sponsors" element={<ManageSponsors />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="committee" element={<CommitteeReform />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={
          <div style={{ 
            textAlign: 'center', 
            padding: '150px 20px', 
            color: 'white', 
            background: '#000', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '1.5rem' }}>Page Not Found</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
              The page you are looking for does not exist or has been moved.
            </p>
            <a href="/" style={{ 
              color: '#d32f2f', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              border: '1px solid #d32f2f',
              padding: '10px 25px',
              borderRadius: '5px'
            }}>
              Return to UBSA Home
            </a>
          </div>
        } />
      </Routes>

      {/* Hide Public Footer when inside any Admin route */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;