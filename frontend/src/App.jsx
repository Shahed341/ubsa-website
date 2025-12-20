import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Sponsors from './pages/Sponsors';
import AddEvent from './pages/adminpages/AddEvent';
import ManageGallery from './pages/adminpages/ManageGallery';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/admin/manage-gallery" element={<ManageGallery />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;