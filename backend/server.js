const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db'); 

dotenv.config();

// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes'); 
const sponsorRoutes = require('./routes/sponsorRoutes');
const memberRoutes = require('./routes/memberRoutes'); 
const contactRoutes = require('./routes/contactRoutes'); // <--- NEW: For Inbox

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- STATIC FILE SERVING ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API ROUTES ---
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes); 

// FIX: Changed from '/api/sponsor-applications' to '/api/sponsors' 
// to match frontend calls and resolve 404
app.use('/api/sponsors', sponsorRoutes); 

app.use('/api/members', memberRoutes); 
app.use('/api/contact-messages', contactRoutes); // <--- NEW: For Inbox

// Basic Test Route
app.get('/', (req, res) => {
  res.send('UBSA API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});