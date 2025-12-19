import React, { useState } from 'react';
import '../style/Sponsors.css';

export default function Sponsors() {
  const [customAmount, setCustomAmount] = useState('');

  // --- MOCK SPONSORS DATA ---
  const sponsors = [
    { id: 1, name: "Global Tech", tier: "Platinum", logo: "https://via.placeholder.com/150?text=Tech+Co" },
    { id: 2, name: "Sask Foods", tier: "Platinum", logo: "https://via.placeholder.com/150?text=Sask+Foods" },
    { id: 3, name: "EduCare", tier: "Gold", logo: "https://via.placeholder.com/150?text=EduCare" },
    { id: 4, name: "Green Energy", tier: "Gold", logo: "https://via.placeholder.com/150?text=Green+Energy" },
    { id: 5, name: "City Print", tier: "Silver", logo: "https://via.placeholder.com/150?text=City+Print" },
    { id: 6, name: "Local Cafe", tier: "Silver", logo: "https://via.placeholder.com/150?text=Local+Cafe" },
  ];

  const donationTiers = [
    { amount: 20, label: "Supporter", desc: "Buy coffee for a meeting" },
    { amount: 50, label: "Contributor", desc: "Help fund a student workshop" },
    { amount: 100, label: "Patron", desc: "Support cultural event logistics" },
  ];

  const handleDonate = (amount) => {
    alert(`Thank you for selecting $${amount}! (Payment Gateway Placeholder)`);
  };

  return (
    <div className="sponsors-page">
      
      {/* Background Orbs for Glass Effect Visualization */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {/* --- HEADER --- */}
      <div className="page-header">
        <h1 className="glass-text">Partners & <span className="text-highlight">Giving</span></h1>
        <p className="page-subtitle">Fueling the future of our community through generosity.</p>
      </div>

      {/* --- SPONSORS SECTION --- */}
      <section className="section-container">
        <h2 className="section-title">Our Proud Sponsors</h2>
        <div className="glass-container sponsors-grid">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className={`sponsor-card ${sponsor.tier.toLowerCase()}`}>
              <div className="logo-wrapper">
                <img src={sponsor.logo} alt={sponsor.name} />
              </div>
              <h3>{sponsor.name}</h3>
              <span className="tier-badge">{sponsor.tier} Partner</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- DONATION SECTION --- */}
      <section className="section-container">
        <h2 className="section-title">Support Our Mission</h2>
        <div className="glass-container donation-wrapper">
          
          <div className="donation-grid">
            {donationTiers.map((tier) => (
              <div key={tier.amount} className="donation-card" onClick={() => handleDonate(tier.amount)}>
                <div className="amount">${tier.amount}</div>
                <h4>{tier.label}</h4>
                <p>{tier.desc}</p>
                <button className="btn-glass">Select</button>
              </div>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="custom-donation">
            <label>Or enter a custom amount</label>
            <div className="input-group">
              <span className="currency-symbol">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button className="btn-glass-filled" onClick={() => handleDonate(customAmount)}>
                Donate
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}