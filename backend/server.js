const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded images publicly

// Basic Test Route
app.get('/', (req, res) => {
  res.send('UBSA API is running...');
});

// --- ROUTES WILL GO HERE LATER ---
// app.use('/api/events', require('./routes/eventRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});