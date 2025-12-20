import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/HomeSponsors.css';

export default function HomeSponsors() {
  const [sponsors, setSponsors] = useState([]);

  // Fetch Sponsors logic moved here
  useEffect(() => {
    fetch('http://localhost:5000/api/sponsors')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setSponsors(data.slice(0, 3)); // Only show top 3
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

  return (
    <section className="home-sponsors-section">
      {/* Dark Overlay */}
      <div className="overlay-dark"></div>
      
      <div className="content-wrapper">
        <h2 className="section-title-home">Our <span className="highlight">Partners</span></h2>
        <p className="section-subtitle">Empowering our community through generous support.</p>

        {/* Sponsors Grid */}
        <div className="home-sponsors-grid">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="sponsor-preview-card glass-effect">
              <div className="sp-img-box">
                <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
              </div>
              <div className="sp-info">
                <h3>{sponsor.name}</h3>
                <div className="tier-badge">{sponsor.tier || "Partner"}</div>
                <p className="discount-preview">
                  {sponsor.discount_title ? `🔒 ${sponsor.discount_title}` : "🔒 Exclusive Perks"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="action-row">
          <Link to="/sponsors" className="btn-view-partners">
            View All Partners & Discounts →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Mock Data
const MOCK_HOME_SPONSORS = [
  { id: 1, name: "Deshi Bazaar", tier: "Platinum", discount_title: "10% OFF Groceries" },
  { id: 2, name: "Saskatoon Tech", tier: "Gold", discount_title: "Free Diagnostics" },
  { id: 3, name: "Spicy Bite", tier: "Silver", discount_title: "BOGO Drinks" },
];