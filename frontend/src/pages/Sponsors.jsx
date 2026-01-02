import React, { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt,
  FaHandshake,
  FaLock,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaPercentage,
  FaRibbon,
  FaGlobe,
  FaPhoneAlt
} from 'react-icons/fa';
import SponsorFormModal from '../components/SponsorFormModal';
import '../style/Sponsors.css';
import '../style/Events.css';

// Local Asset for Background
import sponsorPageBg from '../assets/Sponsors_page_bg.jpg';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch Approved Sponsors
  useEffect(() => {
    fetch('http://localhost:5000/api/sponsors')
      .then((res) => res.json())
      .then((data) => {
        setSponsors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sponsors:', err);
        setLoading(false);
      });
  }, []);

  // Helper to handle dynamic image paths from the backend uploads folder
  const getImageUrl = (url) => {
    if (!url) return '';
    // If it's a full URL (like a placeholder), use it; otherwise, prefix with backend domain
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  // Tiered Rendering Logic
  const renderSponsorTier = (tierName) => {
    const tierSponsors = sponsors.filter((s) => s.tier === tierName);
    if (tierSponsors.length === 0) return null;

    return (
      <div className={`tier-section tier-${tierName.toLowerCase()}`} key={tierName}>
        <div className="tier-header">
          <FaRibbon className="tier-icon" />
          <h2>{tierName} Partners</h2>
          <div className="tier-line"></div>
        </div>
        <div className="sponsors-grid-container">
          {tierSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="glass-sponsor-card clickable"
              onClick={() => setSelectedSponsor(sponsor)}
            >
              <div className="card-header">
                <div className="sponsor-logo-wrapper bigger-logo">
                  <img src={getImageUrl(sponsor.image_url)} alt={sponsor.name} />
                </div>
              </div>

              <div className="card-body">
                <h2 className="sponsor-name">{sponsor.name}</h2>
                {sponsor.discount_title ? (
                  <div className="badge-perk">
                    <FaPercentage /> Member Perk
                  </div>
                ) : (
                  <div className="badge-donation">
                    <FaHandshake /> Community Supporter
                  </div>
                )}
              </div>

              {sponsor.discount_title && (
                <div className="card-footer-discount-mini">
                  <p>{sponsor.discount_title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-text">Connecting to Partners...</div>;

  return (
    <div 
      className="sponsors-page" 
      style={{ '--sponsor-bg': `url(${sponsorPageBg})` }}
    >
      <header className="sponsors-hero">
        <div className="title-glass-container">
          <h1 className="page-title">
            <span className="text-white">Our</span> 
            <span className="text-orange">Partners</span>
          </h1>
        </div>
        <p className="page-subtitle">
          Supporting the USask Bangladeshi community through strategic collaboration.
        </p>

        <button className="btn-become-sponsor-ubsa" onClick={() => setIsFormOpen(true)}>
          <FaHandshake /> Become a Sponsor
        </button>
      </header>

      {/* Main Grid categorized by Tier */}
      <section className="categorized-sponsors-list">
        {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => renderSponsorTier(tier))}
      </section>

      {/* Sponsor Details Modal */}
      {selectedSponsor && (
        <SponsorModal 
          sponsor={selectedSponsor} 
          onClose={() => setSelectedSponsor(null)} 
          getImageUrl={getImageUrl}
        />
      )}

      {/* Application Form Modal (Supports File Upload) */}
      {isFormOpen && <SponsorFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}

/**
 * Sub-component: SponsorModal
 * Displays detailed information about a clicked sponsor
 */
const SponsorModal = ({ sponsor, onClose, getImageUrl }) => (
  <div className="event-modal-overlay" onClick={onClose}>
    <div className="event-modal-glass sponsor-modal-wide" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-btn" onClick={onClose}>&times;</button>
      
      <div className="modal-content-wrapper">
        <div className="modal-details">
          <span className={`sponsor-tier-badge-modal tier-${sponsor.tier?.toLowerCase()}`}>
            {sponsor.tier} Partner
          </span>
          <h2 className="modal-title">{sponsor.name}</h2>
          
          <div className="sponsor-contact-actions">
            {sponsor.website_url && (
              <a href={sponsor.website_url} target="_blank" rel="noreferrer" className="action-link-btn">
                <FaGlobe /> Website
              </a>
            )}
            {sponsor.phone && (
              <a href={`tel:${sponsor.phone}`} className="action-link-btn">
                <FaPhoneAlt /> Call
              </a>
            )}
          </div>

          {sponsor.discount_title && (
            <div className="sponsor-modal-discount gold-glow">
              <h3><FaLock /> Member Exclusive Perk</h3>
              <p className="discount-title"><FaPercentage /> {sponsor.discount_title}</p>
            </div>
          )}

          <div className="modal-description-scroll">
            <h3><FaInfoCircle /> About</h3>
            <p>{sponsor.description}</p>
            <p className="modal-location-text">
              <FaMapMarkerAlt /> {sponsor.location || 'Saskatoon, SK'}
            </p>
          </div>
        </div>

        <div className="modal-image-col centered-logo-col">
          <img 
            src={getImageUrl(sponsor.image_url)} 
            alt={sponsor.name} 
            className="modal-logo-large" 
          />
        </div>
      </div>
    </div>
  </div>
);