const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. POST: Submit New Application (Public Form) ---
router.post('/', async (req, res) => {
    // Destructuring all the new fields from your updated SponsorFormModal
    const { 
        business_name, 
        email, 
        location, 
        description, 
        tier, 
        discount_title, 
        payment_type,
        contact_person // Defaulted to 'Web Submission' in your frontend state
    } = req.body;
    
    // Basic Validation
    if (!business_name || !email || !description) {
        return res.status(400).json({ error: "Business name, email, and description are required" });
    }

    try {
        const sql = `INSERT INTO sponsor_applications 
                     (business_name, contact_person, email, location, tier, description, discount_title, payment_type, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
        
        const [result] = await db.query(sql, [
            business_name, 
            contact_person || 'Web Submission', 
            email, 
            location, 
            tier, 
            description, 
            discount_title || null, 
            payment_type
        ]);

        console.log(`✅ New Sponsor Application: ${business_name}`);
        res.status(201).json({ success: true, message: "Application submitted!", id: result.insertId });
    } catch (err) {
        console.error("❌ Database Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 2. GET: Fetch all applications (For Admin Dashboard) ---
router.get('/applications', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM sponsor_applications ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. GET: Fetch Approved Sponsors (For Public Sponsors Page) ---
router.get('/', async (req, res) => {
    try {
        // Only fetch sponsors you've moved to the 'sponsors' table
        const [rows] = await db.query("SELECT * FROM sponsors ORDER BY tier ASC, name ASC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 4. POST: Approve Sponsor (Moves App to Public List) ---
router.post('/approve/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [apps] = await connection.query("SELECT * FROM sponsor_applications WHERE id = ?", [id]);
        if (apps.length === 0) return res.status(404).json({ message: "Application not found" });
        const app = apps[0];

        // Moves the enriched data to the public sponsors table
        const sqlPublic = `INSERT INTO sponsors 
                           (name, tier, location, description, discount_title) 
                           VALUES (?, ?, ?, ?, ?)`;
        await connection.query(sqlPublic, [
            app.business_name, 
            app.tier, 
            app.location, 
            app.description, 
            app.discount_title
        ]);

        // Update application status to 'Approved'
        await connection.query("UPDATE sponsor_applications SET status = 'Approved' WHERE id = ?", [id]);

        await connection.commit();
        res.json({ success: true, message: "Sponsor approved and published!" });
    } catch (err) {
        await connection.rollback();
        console.error("Approval Error:", err.message);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// --- 5. DELETE: Remove Application ---
router.delete('/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM sponsor_applications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Application deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;