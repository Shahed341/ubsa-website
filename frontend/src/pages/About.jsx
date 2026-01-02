import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaHandshake, FaCalendarAlt, 
  FaGraduationCap, FaQuoteLeft, FaHistory, FaArrowRight, FaFileContract 
} from 'react-icons/fa';
import '../style/About.css';

// --- IMAGE IMPORTS ---
import PresidentImg from '../assets/Team/Rubana_Sayeda.png';
import VPImg from '../assets/Team/Nusrat_Ahona.png';
import FinanceImg from '../assets/Team/Mohammed_Khan.png';
import EventDirImg from '../assets/Team/Rodoshy_Prithibi.png';
import EventCoordImg from '../assets/Team/Ishrat_Maya.png';
import OutreachImg from '../assets/Team/Rab_Ahmed_Rwna.png';
import SocialImg from '../assets/Team/Abir_Khan.png';

export default function About() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [stats, setStats] = useState({ members: 0, sponsors: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [memRes, sponRes] = await Promise.all([
          fetch('http://localhost:5000/api/members'),
          fetch('http://localhost:5000/api/sponsors')
        ]);
        const memData = await memRes.json();
        const sponData = await sponRes.json();

        setStats({
          members: Array.isArray(memData) ? memData.length : 0,
          sponsors: Array.isArray(sponData) ? sponData.length : 0
        });
      } catch (err) {
        console.error("Error fetching DB stats:", err);
        setStats({ members: 500, sponsors: 15 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const president = TEAM_DATA[0];
  const otherTeam = TEAM_DATA.slice(1);

  return (
    <div className="about-page-wrapper">
      <div className="about-content">
        
        {/* SECTION 1: STATS HERO */}
        <section className="about-stats-hero">
          <div className="stats-container-row glass-screen">
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <div className="stat-text-group">
                <h2>{loading ? "--" : stats.members}+</h2>
                <p>Members</p>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <FaHandshake className="stat-icon" />
              <div className="stat-text-group">
                <h2>{loading ? "--" : stats.sponsors}+</h2>
                <p>Sponsors</p>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-text-group">
                <h2>2024</h2>
                <p>Founded</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MOTIVE */}
        <section className="mission-section">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="glass-screen mission-card motive-themed"
          >
             <h2 className="text-highlight"><FaQuoteLeft /> Our Motive</h2>
             <p>
               UBSA aims to support the unique needs of Bangladeshi undergraduate students at USask[cite: 11]. 
               We bridge the gap between tradition and campus life, helping students navigate university 
               services and cultural representation[cite: 16, 18].
             </p>
             {/* Corrected Navigation Route */}
             <button 
                className="btn-constitution-link"
                onClick={() => navigate('/constitution')}
             >
               <FaFileContract /> Read Our Constitution
             </button>
          </motion.div>
        </section>

        {/* SECTION 3: EXECUTIVES */}
        <section className="team-section">
          <h2 className="section-title">Meet the <span className="text-highlight-red">Executive Team</span></h2>
          
          <div className="president-featured-row">
            <motion.div className="glass-screen president-big-card" whileHover={{ scale: 1.01 }}>
              <div className="pres-layout">
                <img src={president.image} alt={president.name} className="pres-img" />
                <div className="pres-info">
                  <span className="role-tag-gold">President & Founder</span>
                  <h3>{president.name}</h3>
                  <p className="dept-text"><FaGraduationCap /> {president.dept}</p>
                  <p className="punchline">"{president.punchline}"</p>
                  <p className="pres-bio">{president.bio}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="team-grid-3-col">
            {otherTeam.map((member, index) => (
              <motion.div 
                key={index}
                layout
                onClick={() => toggleExpand(index)}
                className={`glass-screen team-card-small ${expandedIndex === index ? 'expanded' : ''}`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="card-header-simple">
                  <img src={member.image} alt={member.name} className="mini-img-small" />
                  <div className="mini-meta">
                    <span className="mini-role">{member.role}</span>
                    <h4>{member.name}</h4>
                    
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="expand-details"
                        >
                          <hr className="detail-divider" />
                          <p className="dept-text"><FaGraduationCap /> {member.dept}</p>
                          <p className="punchline-small">"{member.punchline}"</p>
                          <p className="bio-text">{member.bio}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 4: LEGACY */}
        <section className="legacy-section">
          <div className="glass-screen legacy-card-small">
            <FaHistory className="legacy-icon-small" />
            <h2>Our Legacy</h2>
            <button className="btn-send-home-small" onClick={() => navigate('/legacy')}>
              Past Committees <FaArrowRight />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const TEAM_DATA = [
  { name: "Rubana Sayeda", role: "President", dept: "Economics", punchline: "Leading with vision, uniting with passion.", bio: "Oversees all positions and prepares the annual report[cite: 67].", image: PresidentImg },
  { name: "Nusrat Ahona", role: "Vice President", dept: "Computer Science", punchline: "Debugging the blueprint for club success.", bio: "Manages administrative tasks and internal coordination[cite: 71].", image: VPImg },
  { name: "Mohammed Khan", role: "Finance Director", dept: "Business", punchline: "Making every contribution count.", bio: "Manages funds and presents financial statements[cite: 73, 139].", image: FinanceImg },
  { name: "Rodoshy Prithibi", role: "Event Director", dept: "Psychology", punchline: "Turning cultural ideas into reality.", bio: "Plans and organizes cultural and social activities[cite: 77].", image: EventDirImg },
  { name: "Ishrat Maya", role: "Event Coordinator", dept: "Engineering", punchline: "Coordinating the art of perfect events.", bio: "Recruits volunteers and manages logistics[cite: 80].", image: EventCoordImg },
  { name: "Rab Ahmed Rwna", role: "Outreach Director", dept: "Political Science", punchline: "Building bridges beyond the campus.", bio: "Coordinates volunteer opportunities and partnerships[cite: 84].", image: OutreachImg },
  { name: "Abir Khan", role: "Social Director", dept: "Arts & Science", punchline: "Creating social vibes that stick.", bio: "Manages social media presence and promotes activities[cite: 75].", image: SocialImg }
];