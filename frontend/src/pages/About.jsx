import React from 'react';
import '../style/About.css';

// Placeholder images for team members
// You can replace these with local imports like: import president from '../assets/team/president.jpg'
const TEAM_MEMBERS = [
  { id: 1, name: "Name Here", role: "President", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { id: 2, name: "Name Here", role: "VP - Internal", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
  { id: 3, name: "Name Here", role: "VP - External", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
  { id: 4, name: "Name Here", role: "General Secretary", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" },
  { id: 5, name: "Name Here", role: "Treasurer", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { id: 6, name: "Name Here", role: "Cultural Secretary", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
];

export default function About() {
  return (
    <div className="about-page">
      
      {/* 1. HERO SECTION */}
      <div className="about-hero">
        <h1 className="page-title">Who <span className="text-highlight">We Are</span></h1>
        <p className="page-subtitle">
          The University of Saskatchewan Bangladeshi Students' Association (UBSA) is a non-profit organization dedicated to representing and supporting Bangladeshi students in Saskatoon.
        </p>
      </div>

      {/* 2. MISSION & VISION */}
      <div className="mission-vision-container">
        <div className="mv-card">
          <div className="mv-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To foster a welcoming community for Bangladeshi students, promoting our rich cultural heritage while providing academic support, networking opportunities, and a home away from home.
          </p>
        </div>
        <div className="mv-card">
          <div className="mv-icon">🌟</div>
          <h2>Our Vision</h2>
          <p>
            To be the leading student organization that empowers Bangladeshi students to excel academically and socially, bridging the gap between our culture and the diverse community of Saskatchewan.
          </p>
        </div>
      </div>

      {/* 3. EXECUTIVE COMMITTEE */}
      <div className="team-section">
        <h2 className="section-title">Meet the <span className="text-highlight">Executive Committee</span></h2>
        <div className="team-grid">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-img-wrapper">
                <img src={member.img} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. JOIN US SECTION */}
      <div className="join-us-section">
        <div className="join-content">
          <h2>Why Join UBSA?</h2>
          <ul className="benefits-list">
            <li>🤝 <strong>Community:</strong> Connect with fellow students and alumni.</li>
            <li>🎉 <strong>Events:</strong> Exclusive access to cultural festivals and parties.</li>
            <li>📚 <strong>Support:</strong> Academic guidance and mentorship programs.</li>
            <li>📢 <strong>Voice:</strong> Have a say in student affairs and representation.</li>
          </ul>
          <a href="mailto:ubsa.usask@gmail.com" className="btn-join-large">
            Become a Member Today
          </a>
        </div>
      </div>

    </div>
  );
}