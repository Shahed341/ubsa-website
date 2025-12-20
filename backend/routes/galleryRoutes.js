const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. MULTER CONFIGURATION ---
// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files here
    },
    filename: function (req, file, cb) {
        // Create unique filename: image-timestamp.jpg
        cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- 2. GET ALL PHOTOS ---
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// --- 3. ADD NEW PHOTO (UPDATED FOR FILE UPLOAD) ---
// 'image' is the key name we will use in the frontend form
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { category, caption } = req.body;
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded." });
        }

        // Create the URL (Assuming server runs on port 5000)
        // We store the full URL or relative path. 
        // NOTE: Ensure your server.js has: app.use('/uploads', express.static('uploads'));
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        const sql = "INSERT INTO gallery (src, category, caption) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [imageUrl, category, caption]);

        res.status(201).json({ message: "Photo uploaded!", id: result.insertId, src: imageUrl });
    } catch (err) {
        console.error("Error adding photo:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// --- 4. DELETE PHOTO ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Optional: First get the image path to delete the file from disk too
        // const [rows] = await db.query("SELECT src FROM gallery WHERE id = ?", [id]);
        // ... fs.unlink logic here if you want to save space ...

        const sql = "DELETE FROM gallery WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Photo not found" });
        }
        res.json({ message: "Photo deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;