import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

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

// --- ADMIN PAGES ---
import Login from './pages/adminpages/Login';
import Dashboard from './pages/adminpages/Dashboard';
import AddEvent from './pages/adminpages/AddEvent';
import ManageGallery from './pages/adminpages/ManageGallery';

function App() {
  const location = useLocation();

  // Logic: True if URL starts with "/admin", False otherwise
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* 1. Show Navbar if NOT Admin */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/add-event" element={<ProtectedAdminRoute><AddEvent /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-gallery" element={<ProtectedAdminRoute><ManageGallery /></ProtectedAdminRoute>} />
      </Routes>

      {/* 2. Show Footer if NOT Admin */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;