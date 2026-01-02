import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaGavel, FaUsers, FaUserTie, FaVoteYea, 
  FaHandHoldingUsd, FaShieldAlt, FaFileContract,
  FaBalanceScale, FaComments, FaGraduationCap
} from 'react-icons/fa';

// Import the logo from the path confirmed in your terminal
import ubsaLogo from '../assets/UBSA_Logo.png'; 
import '../style/Constitution.css'; 

export default function Constitution() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="about-page-wrapper full-width-wrapper">
      <motion.div 
        className="about-content wide-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO SECTION */}
        <section className="constitution-hero">
          <div className="glass-screen mission-card header-glass">
            {/* UBSA LOGO IN THE MIDDLE */}
            <div className="hero-logo-container">
               <img src={ubsaLogo} alt="UBSA Logo" className="hero-ubsa-logo" />
            </div>
            <h1><span className="ubsa-red">UBSA</span> Constitution</h1>
            <p className="subtitle-orange">Academic Year 2025 - 2026</p>
            <p className="hero-description">
              The governing framework for the Undergraduate Bangladeshi Students' Association at the University of Saskatchewan [Article I].
            </p>
          </div>
        </section>

        {/* ARTICLE I: OBJECTIVES & NON-DISCRIMINATION */}
        <motion.section variants={sectionVariants} className="constitution-section">
          <div className="glass-screen team-card expanded frosted-green-card">
            <div className="centered-content">
              <span className="mini-role">Article I, Section 2 & 3</span>
              <h2><FaGavel /> Objectives & Non-Discrimination Policy</h2>
              <hr className="centered-divider" />
              <div className="bio-text">
                <p>UBSA specifically focuses on Bangladeshi origin undergraduates to ensure their experiences and voices are represented [Article I, Section 2].</p>
                <h4 className="sub-header-orange">Key Association Objectives:</h4>
                <ul className="centered-list">
                  <li>• <strong>Volunteering Opportunities:</strong> Create meaningful volunteer experiences that enhance members' skills [Article I, Section 2, Obj 1].</li>
                  <li>• <strong>Collaboration:</strong> Partner with various USSU groups to better serve undergraduate students [Article I, Section 2, Obj 2].</li>
                  <li>• <strong>Cultural Awareness:</strong> Promote Bangladeshi culture through events to foster pride [Article I, Section 2, Obj 3].</li>
                  <li>• <strong>Access to Financial Aid:</strong> Assist students in accessing aid and university services [Article I, Section 2, Obj 4].</li>
                  <li>• <strong>Onboarding Support:</strong> Facilitate the process for new students to navigate university life [Article I, Section 2, Obj 5].</li>
                </ul>
                <p className="important-info-red">
                  Non-Discrimination Policy: This association and its members shall not promote any discrimination based on race, color, creed, religion, sexual orientation, gender, age, or disability [Article I, Section 3].
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ARTICLE II & V: MEMBERSHIP & MEETINGS */}
        <motion.section variants={sectionVariants} className="constitution-section">
          <div className="team-grid-3-col">
            <div className="glass-screen team-card frosted-green-card">
              <div className="centered-content">
                <span className="mini-role">Article II, Section 1 & 2</span>
                <h3><FaUsers /> Membership</h3>
                <ul className="bio-text list-no-bullets">
                  <li><strong>General Members:</strong> All undergraduate students meeting eligibility [Article II, Section 2].</li>
                  <li><strong>Executive Members:</strong> Subset elected to lead and manage the organization [Article II, Section 2].</li>
                  <li><strong>Alumni Members:</strong> Graduates wishing to maintain ties [Article XI, Section 2].</li>
                </ul>
              </div>
            </div>
            <div className="glass-screen team-card frosted-green-card">
              <div className="centered-content">
                <span className="mini-role">Article II, Section 5</span>
                <h3><FaBalanceScale /> Termination</h3>
                <p className="bio-text">Membership may be terminated for acting against UBSA interests or failing responsibilities [Article II, Section 5].</p>
                <p className="important-info-red">Harassment complaints lead to investigation and a potential 1-year ban [Article II, Section 5].</p>
              </div>
            </div>
            <div className="glass-screen team-card frosted-green-card">
              <div className="centered-content">
                <span className="mini-role">Article V, Section 2</span>
                <h3><FaComments /> Meetings</h3>
                <p className="bio-text">The Executive Team shall meet once a week excluding final exam seasons in December and April [Article V, Section 2].</p>
                <p className="important-info-red">A quorum of at least 75% of Executive Team members is required for official business [Article V, Section 2].</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ARTICLE III: EXECUTIVE TEAM RESPONSIBILITIES */}
        <motion.section variants={sectionVariants}>
          <div className="glass-screen mission-card frosted-green-card">
            <div className="centered-content">
              <span className="mini-role">Article III, Section 3</span>
              <h2><FaUserTie /> Executive Team Responsibilities</h2>
              <hr className="centered-divider" />
              <div className="responsibilities-grid">
                <div>
                  <h4 className="sub-header-orange">President</h4>
                  <p className="bio-text-small">Oversees all positions, presides over meetings, and handles the annual report [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Vice President</h4>
                  <p className="bio-text-small">Manages administrative tasks and ensures smooth coordination amongst the team [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Director of Finance</h4>
                  <p className="bio-text-small">Manages funds, presents financial statements, and ensures transitions [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Director of Socials</h4>
                  <p className="bio-text-small">Organizes social events and manages the association's social media presence [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Director of Events</h4>
                  <p className="bio-text-small">Plans and organizes all cultural, social, and sports activities [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Event Coordinator</h4>
                  <p className="bio-text-small">Plans and executes events, managing logistics and volunteers [Article III, Section 3].</p>
                </div>
                <div>
                  <h4 className="sub-header-orange">Director of Outreach</h4>
                  <p className="bio-text-small">Builds partnerships and coordinates volunteer opportunities [Article III, Section 3].</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ARTICLE VI & XI: ACCOUNTABILITY & ALUMNI */}
        <div className="team-grid">
          <motion.div variants={sectionVariants} className="glass-screen team-card frosted-green-card">
            <div className="centered-content">
              <span className="mini-role">Article VI, Section 1 & 2</span>
              <h3><FaHandHoldingUsd /> Accountability</h3>
              <p className="bio-text">Financial transactions require joint signatures from the President and Director of Finance [Article VI, Section 1].</p>
              <p className="important-info-red">Annual financial reports are presented to members before transitions [Article VI, Section 2].</p>
            </div>
          </motion.div>

          <motion.div variants={sectionVariants} className="glass-screen team-card frosted-green-card">
            <div className="centered-content">
              <span className="mini-role">Article XI, Section 5</span>
              <h3><FaGraduationCap /> Alumni Policy</h3>
              <p className="bio-text">Alumni share experiences and provide mentorship for current undergraduate members [Article XI, Section 3].</p>
              <p className="important-info-red">Alumni must pay 2-3 times the regular ticket price unless invited by the ET [Article XI, Section 5].</p>
            </div>
          </motion.div>
        </div>

        {/* FOOTER / DISSOLUTION */}
        <section className="legacy-section">
          <div className="glass-screen legacy-card frosted-green-footer">
            <div className="centered-content">
              <h3><FaShieldAlt /> Article XII: Dissolution</h3>
              <p className="bio-text">
                Upon dissolution, remaining funds are donated to registered charities or UNICEF's ongoing initiatives [Article XII, Section 2].
              </p>
              <p className="footer-copyright">
                Undergraduate Bangladeshi Students' Association | University of Saskatchewan [Article I, Section 1]
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}