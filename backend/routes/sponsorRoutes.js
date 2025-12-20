const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. GET: Fetch all sponsor applications for Dashboard ---
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sponsor_applications ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Sponsor Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching applications" });
  }
});

// --- 2. POST: Handle new sponsor application (Public Modal) ---
router.post('/', async (req, res) => {
  const { businessName, email, tier, paymentType } = req.body;
  
  const sqlInsert = `INSERT INTO sponsor_applications 
    (business_name, email, tier, payment_type) 
    VALUES (?, ?, ?, ?)`;
  
  try {
    await db.query(sqlInsert, [businessName, email, tier, paymentType]);
    console.log(`🤝 New Sponsor Inquiry: ${businessName}`);
    res.status(201).json({ success: true, message: "Application submitted successfully!" });
  } catch (err) {
    console.error("❌ Sponsor Submit Error:", err.message);
    res.status(500).json({ success: false, message: "Database error occurred" });
  }
});

// --- 3. DELETE: Remove Sponsor Inquiry (Dashboard Action) ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM sponsor_applications WHERE id = ?", [id]);
    console.log(`🗑️ Sponsor Application Deleted: ID ${id}`);
    res.json({ success: true, message: "Application removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete application" });
  }
});

module.exports = router;