import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Protection
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';
import Join from './pages/Join';

// --- ADMIN PAGES ---
import Login from './pages/adminpages/Login';
import Dashboard from './pages/adminpages/Dashboard';

import MembersPage from './pages/adminpages/MembersPage';
import Inbox from './pages/adminpages/Inbox';
import ManageSponsors from './pages/adminpages/ManageSponsors';
import AddEvent from './pages/adminpages/AddEvent';
import ManageGallery from './pages/adminpages/ManageGallery';

function App() {
  const location = useLocation();
  
  // Logic: Hides main Navbar/Footer from the Admin portal entirely
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Show Navbar only on public site */}
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
        
        {/* --- ADMIN AUTH --- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* --- PROTECTED ADMIN SHELL --- */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />}>
            {/* NESTED ROUTES: 
               These render inside the <Outlet /> of Dashboard.jsx 
            */}
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="sponsors" element={<ManageSponsors />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="gallery" element={<ManageGallery />} />
          </Route>
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '150px 20px', color: 'white', background: '#000', minHeight: '100vh' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" style={{ color: '#FF8C00', fontWeight: 'bold' }}>Return Home</a>
          </div>
        } />
      </Routes>

      {/* Show Footer only on public site */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;