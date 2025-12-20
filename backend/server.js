const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Database connection

// Load environment variables
dotenv.config();

// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes'); // <--- Import Gallery Routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded images publicly

// Basic Test Route
app.get('/', (req, res) => {
  res.send('UBSA API is running...');
});

// --- API ROUTES ---
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes); // <--- Use Gallery Routes

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});