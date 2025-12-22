const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all messages for the Admin Inbox
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new message (From the public Contact Us form)
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        await db.query(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            [name, email, subject, message]
        );
        res.status(201).json({ success: true, message: "Message sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a reply (Admin action)
router.post('/reply', async (req, res) => {
    const { messageId } = req.body;
    try {
        // Logic for sending email would go here
        await db.query("UPDATE contact_messages SET status = 'replied' WHERE id = ?", [messageId]);
        res.json({ success: true, message: "Status updated to replied" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;