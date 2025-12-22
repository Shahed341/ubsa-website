import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaHandshake, 
  FaLock, 
  FaExternalLinkAlt, 
  FaInfoCircle, 
  FaPercentage 
} from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import SponsorFormModal from '../components/SponsorFormModal';
import '../style/Sponsors.css';
import '../style/Events.css'; 

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/sponsors')
      .then(res => res.json())
      .then(data => {
        setSponsors(Array.isArray(data) && data.length > 0 ? data : MOCK_SPONSORS);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sponsors:", err);
        setSponsors(MOCK_SPONSORS);
        setLoading(false);
      });
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400?text=UBSA+Partner';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const SponsorModal = ({ sponsor, onClose }) => {
    if (!sponsor) return null;
    return (
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-glass" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <div className="modal-content-wrapper">
            <div className="modal-details">
              <span className="sponsor-tier-badge-modal">{sponsor.tier} Partner</span>
              <h2 className="modal-title">{sponsor.name}</h2>
              
              <div className="modal-meta-row">
                <span className="meta-tag"><FaMapMarkerAlt /> {sponsor.location || "Saskatoon, SK"}</span>
                <span className="meta-tag"><FaHandshake /> {sponsor.contribution_type || "Community Partner"}</span>
              </div>

              <div className="sponsor-modal-discount">
                <h3><FaLock /> Member Exclusive Perk</h3>
                <p className="discount-title">
                   <FaPercentage style={{marginRight: '8px'}} />
                   {sponsor.discount_title || "Special Member Rate"}
                </p>
                <p className="discount-desc">
                   Show your digital UBSA Membership ID to redeem this offer.
                </p>
              </div>

              <div className="modal-description-scroll">
                <h3><FaInfoCircle /> About the Business</h3>
                <p>{sponsor.description}</p>
                
                {sponsor.website_url && (
                   <a href={sponsor.website_url} target="_blank" rel="noreferrer" className="modal-website-link">
                     Visit Official Website <FaExternalLinkAlt style={{fontSize: '0.8rem', marginLeft: '5px'}} />
                   </a>
                )}
              </div>
            </div>
            <div className="modal-image-col">
              <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-text">Connecting to Partners...</div>;

  return (
    <div className="sponsors-page">
      <header className="sponsors-hero">
        <h1 className="page-title">Our <span className="text-highlight">Partners</span></h1>
        <p className="page-subtitle">Supporting the USask Bangladeshi community through collaboration.</p>
        <button className="btn-become-sponsor" onClick={() => setIsFormOpen(true)}>
          <FaHandshake style={{marginRight: '8px'}} /> Become a Sponsor
        </button>
      </header>

      <section className="sponsors-grid-container">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="glass-sponsor-card clickable" onClick={() => setSelectedSponsor(sponsor)}>
            <div className="card-header">
              <div className="sponsor-logo-wrapper">
                <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
              </div>
              <div className={`sponsor-tier-badge tier-${sponsor.tier?.toLowerCase()}`}>
                {sponsor.tier}
              </div>
            </div>
            <div className="card-body">
              <h2 className="sponsor-name">{sponsor.name}</h2>
              <p className="sponsor-location"><FaMapMarkerAlt /> {sponsor.location || "Saskatoon"}</p>
            </div>
            <div className="card-footer-discount">
              <div className="discount-header"><FaLock className="lock-icon" /> Member Perk</div>
              <div className="discount-details">
                <h3>{sponsor.discount_title || "Exclusive Offer"}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      {selectedSponsor && <SponsorModal sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />}
      {isFormOpen && <SponsorFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}

const MOCK_SPONSORS = [
  { 
    id: 1, 
    name: "Deshi Bazaar", 
    tier: "Platinum", 
    location: "Saskatoon, SK",
    contribution_type: "Event Sponsorship", 
    description: "Premium destination for authentic groceries and spices.", 
    discount_title: "10% OFF TOTAL BILL", 
    website_url: "https://google.com" 
  }
];