const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // <--- Import Path Module
const db = require('./config/db'); 

// Load environment variables
dotenv.config();

// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON bodies

// --- STATIC FILE SERVING (CRITICAL FOR UPLOADS) ---
// We use path.join to ensure we get the absolute path to the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('UBSA API is running...');
});

// --- API ROUTES ---
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes); 

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});