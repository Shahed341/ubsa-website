CREATE DATABASE IF NOT EXISTS ubsa_db;
USE ubsa_db;

-- 1. Events Table
-- Matches frontend usage: event.image_url
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255), 
    type ENUM('upcoming', 'past') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Gallery Table
-- FIX: Renamed 'image_url' to 'src' to match ManageGallery.jsx & galleryRoutes.js
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    src TEXT NOT NULL, 
    caption VARCHAR(255),
    category VARCHAR(50) DEFAULT 'Community',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier ENUM('Platinum', 'Gold', 'Silver', 'Bronze') NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255)
);

-- 4. Executives Table
CREATE TABLE IF NOT EXISTS executives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    email VARCHAR(255),
    display_order INT DEFAULT 0
);