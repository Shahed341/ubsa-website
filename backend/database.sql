CREATE DATABASE IF NOT EXISTS ubsa_db;
USE ubsa_db;

-- 1. EVENTS: Core table for managing all club gatherings
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255), 
    type ENUM('upcoming', 'past') DEFAULT 'upcoming',
    ticket_price DECIMAL(10,2) DEFAULT 0.00,
    ticket_limit INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. GALLERY: Media assets for the community page
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    src TEXT NOT NULL, 
    caption VARCHAR(255),
    category VARCHAR(50) DEFAULT 'Community',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SPONSORS: Approved partners displayed on the public website
CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier ENUM('Platinum', 'Gold', 'Silver', 'Bronze') NOT NULL,
    location VARCHAR(255), -- ADDED THIS
    image_url VARCHAR(255),
    contribution_type VARCHAR(255),
    description TEXT,
    discount_title VARCHAR(255),
    discount_desc TEXT,
    website_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. EXECUTIVES: The leadership team for specific sessions
CREATE TABLE IF NOT EXISTS executives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE, 
    session_year VARCHAR(20) DEFAULT '2025-2026',
    display_order INT DEFAULT 0
);

-- 5. MEMBERS: User data with unique ID and QR tracking
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(150),
    status ENUM('Pending', 'Paid', 'Expired') DEFAULT 'Pending',
    payment_date DATETIME NULL,
    qr_code_token VARCHAR(255) UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SPONSOR APPLICATIONS: Inbox for new partnership leads
CREATE TABLE IF NOT EXISTS sponsor_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255), -- ADDED THIS
    tier ENUM('Silver', 'Gold', 'Platinum', 'Bronze') NOT NULL,
    payment_type ENUM('E-Transfer', 'Cheque', 'In-Kind') NOT NULL,
    description TEXT, -- ADDED THIS (from Step 1 of form)
    discount_title VARCHAR(255), -- ADDED THIS
    status ENUM('Pending', 'Reviewed', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 7. EVENT TICKETS: Link between Members and Events
CREATE TABLE IF NOT EXISTS event_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    member_id INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_checked_in BOOLEAN DEFAULT FALSE,
    qr_entry_code VARCHAR(255) UNIQUE,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 8. CONTACT MESSAGES: General inquiries from the public
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('unread', 'replied', 'archived') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);