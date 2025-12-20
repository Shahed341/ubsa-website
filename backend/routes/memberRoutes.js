const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. GET: Fetch all members (With Stats for Dashboard) ---
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM members ORDER BY applied_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching members" });
  }
});

// --- 2. POST: Register Member (Public) ---
router.post('/', async (req, res) => {
  const { firstName, lastName, email, studentId, department } = req.body;
  
  // Create a unique hash for the Digital ID / QR System
  const qrToken = Buffer.from(`${email}-${Date.now()}`).toString('base64').substring(0, 12);

  const sqlInsert = `INSERT INTO members 
    (first_name, last_name, email, student_id, department, qr_code_token) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(sqlInsert, [firstName, lastName, email, studentId, department, qrToken]);
    console.log(`✅ New Registration: ${email}`);
    return res.status(201).json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const [rows] = await db.query("SELECT * FROM members WHERE email = ?", [email]);
      return res.status(400).json({ success: false, existingMember: rows[0] });
    }
    res.status(500).json({ success: false, message: "Database Error" });
  }
});

// --- 3. PUT: Update Payment Status (Treasury Management) ---
router.put('/:id/status', async (req, res) => {
  const { status } = req.body; // 'Paid', 'Pending', or 'Expired'
  const { id } = req.params;

  try {
    // We update the status AND the payment_date timestamp if status is 'Paid'
    const sqlUpdate = status === 'Paid' 
      ? "UPDATE members SET status = ?, payment_date = NOW() WHERE id = ?" 
      : "UPDATE members SET status = ?, payment_date = NULL WHERE id = ?";

    await db.query(sqlUpdate, [status, id]);
    console.log(`💳 Treasury Update: Member ${id} is now ${status}`);
    res.json({ success: true, message: `Member set to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Status update failed" });
  }
});

// --- 4. DELETE: Permanent Removal ---
router.delete('/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM members WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Member removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;