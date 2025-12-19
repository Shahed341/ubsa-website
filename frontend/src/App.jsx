import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import About from './pages/About'; // <--- Import About Page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} /> {/* <--- Add Route */}
        {/* You can point /contact to About if you want the info there, or keep a separate page */}
        <Route path="/contact" element={<About />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;