const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. MULTER CONFIGURATION (For Photos & Video Thumbnails) ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const prefix = file.fieldname === 'videoThumbnail' ? 'thumb-' : 'gallery-';
        cb(null, prefix + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// =========================================
// SECTION A: PHOTOS (gallery table)
// =========================================

// GET ALL PHOTOS
router.get('/photos', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error fetching photos" });
    }
});

// ADD NEW PHOTO
router.post('/photos', upload.single('image'), async (req, res) => {
    try {
        const { category, caption } = req.body;
        if (!req.file) return res.status(400).json({ error: "No image file uploaded." });

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        const sql = "INSERT INTO gallery (src, category, caption) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [imageUrl, category, caption]);

        res.status(201).json({ message: "Photo added!", id: result.insertId, src: imageUrl });
    } catch (err) {
        res.status(500).json({ error: "Server Error adding photo" });
    }
});

// =========================================
// SECTION B: VIDEOS (videos table)
// =========================================

// GET ALL VIDEOS
router.get('/videos', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM videos WHERE is_active = TRUE ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error fetching videos" });
    }
});

// ADD NEW VIDEO (With Optional Thumbnail Upload)
router.post('/videos', upload.single('videoThumbnail'), async (req, res) => {
    try {
        const { title, url, description, category } = req.body;
        
        // If an image was uploaded, create URL; else use a default or null
        const thumbnail = req.file 
            ? `http://localhost:5000/uploads/${req.file.filename}` 
            : null;

        const sql = `
            INSERT INTO videos (title, url, thumbnail, description, category) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [title, url, thumbnail, description, category || 'Event']);

        res.status(201).json({ 
            message: "Video linked successfully!", 
            id: result.insertId,
            thumbnail: thumbnail 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error adding video" });
    }
});

// DELETE VIDEO
router.delete('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM videos WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Video not found" });
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Database error deleting video" });
    }
});

module.exports = router;