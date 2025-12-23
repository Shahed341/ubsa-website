// routes/sponsors.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');


// ----------------------------------------------------
// 1. POST: Submit New Sponsor Application (Public)
// ----------------------------------------------------
router.post('/', async (req, res) => {
  const {
    business_name,
    email,
    phone,
    location,
    tier,
    payment_type,
    description,
    discount_title
  } = req.body;

  // Basic validation
  if (!business_name || !email || !tier || !payment_type || !description) {
    return res.status(400).json({
      success: false,
      error: 'Business name, email, tier, payment type, and description are required'
    });
  }

  try {
    const sql = `
      INSERT INTO sponsor_applications
      (business_name, email, phone, location, tier, payment_type, description, discount_title)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      business_name,
      email,
      phone || null,
      location || null,
      tier,
      payment_type,
      description,
      discount_title || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      id: result.insertId
    });
  } catch (err) {
    console.error('❌ Sponsor application error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ----------------------------------------------------
// 2. GET: Fetch All Sponsor Applications (Admin)
// ----------------------------------------------------
router.get('/applications', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM sponsor_applications ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ----------------------------------------------------
// 3. GET: Fetch Approved Sponsors (Public)
// ----------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM sponsors WHERE is_active = 1 ORDER BY tier ASC, name ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ----------------------------------------------------
// 4. POST: Approve Sponsor Application (Admin)
// ----------------------------------------------------
router.post('/approve/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [apps] = await connection.query(
      'SELECT * FROM sponsor_applications WHERE id = ?',
      [id]
    );

    if (apps.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const app = apps[0];

    await connection.query(
      `
      INSERT INTO sponsors
      (name, tier, location, description, discount_title, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
      `,
      [
        app.business_name,
        app.tier,
        app.location,
        app.description,
        app.discount_title
      ]
    );

    await connection.query(
      "UPDATE sponsor_applications SET status = 'Approved' WHERE id = ?",
      [id]
    );

    await connection.commit();
    res.json({ success: true, message: 'Sponsor approved and published' });
  } catch (err) {
    await connection.rollback();
    console.error('❌ Approval error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
});


// ----------------------------------------------------
// 5. DELETE: Remove Sponsor Application (Admin)
// ----------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM sponsor_applications WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
