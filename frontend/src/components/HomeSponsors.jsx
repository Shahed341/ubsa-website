import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaArrowRight, FaAward, FaCrown, FaStar, FaTags } from 'react-icons/fa';
import '../style/HomeSponsors.css';

export default function HomeSponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sponsors')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setSponsors(data.slice(0, 3));
        } else {
          setSponsors(MOCK_HOME_SPONSORS);
        }
      })
      .catch(() => setSponsors(MOCK_HOME_SPONSORS));
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/400x200/png?text=Partner';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const getTierIcon = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'platinum': return <FaCrown className="hmsp-tier-icon platinum" />;
      case 'gold': return <FaAward className="hmsp-tier-icon gold" />;
      default: return <FaStar className="hmsp-tier-icon silver" />;
    }
  };

  return (
    <section className="hmsp-section">
      <div className="hmsp-content-wrapper">
        <div className="hmsp-header">
          <FaHandshake className="hmsp-header-main-icon" />
          <h2 className="hmsp-section-title">Official <span className="hmsp-highlight">Partners</span></h2>
          <p className="hmsp-section-subtitle">Supporting the Bengali community at USask.</p>
        </div>

        <div className="hmsp-grid">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="hmsp-card-glass">
              {/* Top Right Tier Badge */}
              <div className={`hmsp-top-right-tier ${sponsor.tier?.toLowerCase()}`}>
                {getTierIcon(sponsor.tier)}
                <span>{sponsor.tier}</span>
              </div>

              {/* 1. Picture - Fixed Top-Crop Fill */}
              <div className="hmsp-img-box">
                <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
              </div>
              
              <div className="hmsp-card-body">
                {/* 2. Business Name - RED */}
                <h3 className="hmsp-business-name">{sponsor.name}</h3>

                {/* 3. Description - CREAM */}
                <p className="hmsp-business-desc">
                  {sponsor.description || "A proud partner supporting UBSA events and student initiatives throughout the academic year."}
                </p>

                {/* 4. Offerings - GREEN TINT */}
                <div className="hmsp-offering-box">
                   <FaTags className="hmsp-tag-icon" />
                   <span className="hmsp-benefit-text">
                     {sponsor.discount_title ? sponsor.discount_title : "Member Exclusive Perk"}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hmsp-action-row">
          <Link to="/sponsors" className="hmsp-btn-action">
            Explore All Partners <FaArrowRight style={{marginLeft: '10px'}} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const MOCK_HOME_SPONSORS = [
  { id: 1, name: "Shahed Bazaar", tier: "Platinum", discount_title: "10% OFF Groceries", description: "Your local destination for authentic spices and traditional Bengali groceries." },
  { id: 2, name: "Shahed Tech", tier: "Gold", discount_title: "Free Diagnostics", description: "Providing expert tech support and hardware repairs for USask students." },
  { id: 3, name: "Shahed Bite", tier: "Silver", discount_title: "BOGO Drinks", description: "Experience the true flavors of street food and traditional snacks." },
];