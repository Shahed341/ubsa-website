const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this points to your database connection file

// 1. GET ALL PHOTOS
router.get('/', (req, res) => {
    const sql = "SELECT * FROM gallery ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching gallery:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// 2. ADD NEW PHOTO
router.post('/', (req, res) => {
    const { src, category, caption } = req.body;

    if (!src) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    const sql = "INSERT INTO gallery (src, category, caption) VALUES (?, ?, ?)";
    db.query(sql, [src, category, caption], (err, result) => {
        if (err) {
            console.error("Error adding photo:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Photo added!", id: result.insertId });
    });
});

// 3. DELETE PHOTO
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM gallery WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting photo:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Photo not found" });
        }
        res.json({ message: "Photo deleted successfully" });
    });
});

module.exports = router;