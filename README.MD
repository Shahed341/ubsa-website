# 🐯 UBSA Club Management System

A full-stack "Club Operating System" for the University of Saskatchewan Bangladeshi Students' Association.

## 🚀 Quick Start

1. Backend:  `cd backend && npm install && npm start` (Runs on port 5000)
2. Frontend: `cd frontend && npm install && npm run dev` (Runs on port 5173)
3. Database: Ensure your MySQL/Docker container is running and the schema is applied.
4. Docker:   Locate docker-compose.yml and run `docker-compose up --build`

## Api Integration
1. Instagram: Go to behold.so then register with insta id. Create the json feed URL and paste in HomeInsta.jsx.

## 🛠️ Features

🌐 Public Experience
* Home:     Dynamic hero section, event/gallery previews, and automated sponsor scrolling.
* About:    High-fidelity showcase of the executive committee, mission, and vision.
* Events:   Categorized hub for upcoming registrations and past event archives.
* Gallery:  Filterable masonry grid for community photos and cultural memories.
* Sponsors: Professional tiered partner showcase with student discount highlights.
* Contact:  Integrated communication form with embedded Place Riel campus location.
* Join Us:  Digital membership registration with automated duplicate record prevention.

🔐 Administrative Portal
* Dashboard: Live treasury tracking, member verification, and committee transition tools.

## 📂 Folder Structure

```bash
├── backend/
│   ├── config/db.js      # MySQL Connection Pool
│   ├── routes/           # Member, Sponsor, Event API routes
│   └── server.js         # Express Entry Point
├── src/
│   ├── components/       # Global Navbar, Footer, Auth Guard
│   ├── pages/
│   │   └── adminpages/   # Dashboard, Login, AddEvent
│   └── style/            # Shared CSS & Dashboard Glassmorphism
└── database.sql          # Full schema for members, events, & tickets

```

## 🔐 Admin Access

* Route: `/admin/login`
* Default Key: `tiger2025`

## 🏗️ Technical Stack

* Frontend: React.js, React Router 6, React Icons.
* Backend: Node.js, Express.
* Database: MySQL (Relational schema for members/finances).
* Styling: Modern CSS (Glassmorphism & Flexbox).

## ⚠️ Maintenance Notes

* Payments: Status must be manually toggled to "Paid" in the dashboard after verifying the cash/e-transfer.
* Deletions: Removing a member or event is permanent; ensure double-confirmation is enabled in the UI.