import React, { useState, useEffect } from 'react';
import '../style/Sponsors.css';
// Reusing Event modal styles or define specific ones in Sponsors.css
import '../style/Events.css'; 

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetch('http://localhost:5000/api/sponsors')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
            setSponsors(data);
        } else {
            // Fallback for demo if DB is empty
            setSponsors(MOCK_SPONSORS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sponsors:", err);
        setSponsors(MOCK_SPONSORS);
        setLoading(false);
      });
  }, []);

  // --- 2. HELPER FUNCTIONS ---
  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400?text=Sponsor';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  // --- 3. MODAL COMPONENT (Internal) ---
  const SponsorModal = ({ sponsor, onClose }) => {
    if (!sponsor) return null;
    return (
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-glass" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          
          <div className="modal-content-wrapper">
            {/* LEFT: Text Details */}
            <div className="modal-details">
              <span className="sponsor-tier-badge-modal">{sponsor.tier || "Partner"}</span>
              <h2 className="modal-title">{sponsor.name}</h2>
              
              <div className="modal-meta-row">
                <span className="meta-tag">🤝 Contribution: {sponsor.contribution || "Sponsorship"}</span>
              </div>

              {/* Special Discount Section in Modal */}
              <div className="sponsor-modal-discount">
                <h3>🔒 Member Exclusive</h3>
                <p className="discount-title">{sponsor.discount_title || "Special Deal"}</p>
                <p className="discount-desc">{sponsor.discount_desc || "Show your UBSA membership card to redeem this offer."}</p>
              </div>

              <div className="modal-description-scroll">
                <p>{sponsor.description || "No description available."}</p>
                {sponsor.website && (
                   <a href={sponsor.website} target="_blank" rel="noreferrer" className="modal-website-link">
                     Visit Website →
                   </a>
                )}
              </div>
            </div>

            {/* RIGHT: Image */}
            <div className="modal-image-col">
              <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-text">Loading Partners...</div>;

  return (
    <div className="sponsors-page">
      {/* --- HEADER --- */}
      <header className="sponsors-hero">
        <h1 className="page-title">Our <span className="text-highlight">Partners</span></h1>
        <p className="page-subtitle">
          Collaborating with businesses to bring exclusive value to the UBSA community.
        </p>
      </header>

      {/* --- GRID SECTION --- */}
      <section className="sponsors-grid-container">
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.id} 
            className="glass-sponsor-card clickable" 
            onClick={() => setSelectedSponsor(sponsor)}
          >
            {/* Header: Logo & Tier */}
            <div className="card-header">
              <div className="sponsor-logo-wrapper">
                <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
              </div>
              <div className="sponsor-tier-badge">
                {sponsor.tier || "Partner"}
              </div>
            </div>

            {/* Body: Info */}
            <div className="card-body">
              <h2 className="sponsor-name">{sponsor.name}</h2>
              <p className="sponsor-contribution">
                <span className="label">Contribution:</span> {sponsor.contribution || "Supporting Student Success"}
              </p>
            </div>

            {/* Footer: Discount Preview */}
            <div className="card-footer-discount">
              <div className="discount-header">
                <span className="lock-icon">🔒</span> For Members
              </div>
              <div className="discount-details">
                <h3>{sponsor.discount_title || "View Details"}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* --- CTA --- */}
      <section className="sponsor-cta">
        <h2>Want to become a partner?</h2>
        <a href="mailto:ubsa.usask@gmail.com" className="btn-partner">Contact Us</a>
      </section>

      {/* --- RENDER MODAL --- */}
      {selectedSponsor && (
        <SponsorModal sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />
      )}
    </div>
  );
}

// --- MOCK DATA (Fallback) ---
const MOCK_SPONSORS = [
  {
    id: 1,
    name: "Deshi Bazaar",
    tier: "Platinum",
    image_url: "",
    contribution: "Annual Event Sponsorship",
    description: "The premium destination for authentic South Asian groceries in Saskatoon.",
    discount_title: "10% OFF GROCERIES",
    discount_desc: "Get flat 10% off on bills over $50. Valid on weekends.",
    website: "https://google.com"
  },
  {
    id: 2,
    name: "Saskatoon Tech Hub",
    tier: "Gold",
    image_url: "",
    contribution: "Workshop Equipment",
    description: "Providing laptops and tech support for our coding workshops.",
    discount_title: "FREE DIAGNOSTIC",
    discount_desc: "Free laptop checkup and 15% off repairs for students."
  },
  {
    id: 3,
    name: "Spicy Bite Restaurant",
    tier: "Silver",
    image_url: "",
    contribution: "Food Catering",
    description: "Serving the spiciest and tastiest curries in town since 2015.",
    discount_title: "BUY 1 GET 1 DRINK",
    discount_desc: "Complimentary drink with any main course meal."
  }
];