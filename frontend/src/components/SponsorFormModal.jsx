import React, { useState } from 'react';
import { FaTimes, FaMoneyBillWave, FaUniversity, FaMapMarkerAlt, FaStore, FaTag } from 'react-icons/fa';
import '../style/SponsorForm.css';

export default function SponsorFormModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    location: '',      // New Field
    description: '',   // New Field
    discount_title: '', // Optional Discount
    tier: 'Silver',
    payment_type: 'E-Transfer', // Aligned with DB Enum
    contact_person: 'Web Submission'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      return setStep(2);
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Check backend routes.");
      }

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted! Our team will contact you shortly.");
        onClose();
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sponsor-form-glass" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <h2>{step === 1 ? "Partner with UBSA" : "Contribution Type"}</h2>
        <p className="step-indicator">Step {step} of 2</p>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="form-steps">
              {/* Business Name */}
              <div className="form-group-modal">
                <label><FaStore /> Business Name *</label>
                <input 
                  type="text" 
                  name="business_name"
                  placeholder="e.g. Deshi Bazaar" 
                  required 
                  value={formData.business_name}
                  onChange={handleChange} 
                />
              </div>

              {/* Location */}
              <div className="form-group-modal">
                <label><FaMapMarkerAlt /> Business Location *</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="e.g. 123 Main St, Saskatoon" 
                  required 
                  value={formData.location}
                  onChange={handleChange} 
                />
              </div>

              {/* Email */}
              <div className="form-group-modal">
                <label>Contact Email *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="contact@business.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange} 
                />
              </div>

              {/* Description */}
              <div className="form-group-modal">
                <label>What does your business do? *</label>
                <textarea 
                  name="description"
                  placeholder="Briefly describe your services..." 
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleChange} 
                />
              </div>

              {/* Optional Discount */}
              <div className="form-group-modal">
                <label><FaTag /> Member Discount (Optional)</label>
                <input 
                  type="text" 
                  name="discount_title"
                  placeholder="e.g. 10% off for UBSA members" 
                  value={formData.discount_title}
                  onChange={handleChange} 
                />
              </div>

              <button type="submit" className="btn-next">
                Next: Payment & Donation
              </button>
            </div>
          ) : (
            <div className="payment-steps">
              <div className="form-group-modal">
                <label>Select Sponsorship Tier (Donation)</label>
                <select name="tier" value={formData.tier} onChange={handleChange}>
                  <option value="Bronze">Bronze Tier ($50+)</option>
                  <option value="Silver">Silver Tier ($100+)</option>
                  <option value="Gold">Gold Tier ($250+)</option>
                  <option value="Platinum">Platinum Tier ($500+)</option>
                </select>
              </div>

              <p className="payment-instruction">Choose your contribution method:</p>
              
              <div 
                className={`pay-option ${formData.payment_type === 'E-Transfer' ? 'selected' : ''}`} 
                onClick={() => setFormData({...formData, payment_type: 'E-Transfer'})}
              >
                <FaMoneyBillWave className="pay-icon" />
                <div className="pay-text">
                  <span>Interac E-Transfer</span>
                  <small>Fast & Secure digital transfer</small>
                </div>
                <input type="radio" checked={formData.payment_type === 'E-Transfer'} readOnly />
              </div>

              <div 
                className={`pay-option ${formData.payment_type === 'Cheque' ? 'selected' : ''}`} 
                onClick={() => setFormData({...formData, payment_type: 'Cheque'})}
              >
                <FaUniversity className="pay-icon" />
                <div className="pay-text">
                  <span>Cheque / Invoice</span>
                  <small>Physical cheque or business invoice</small>
                </div>
                <input type="radio" checked={formData.payment_type === 'Cheque'} readOnly />
              </div>

              <button type="submit" className="btn-final" disabled={loading}>
                {loading ? "Processing..." : "Submit Application"}
              </button>
              
              <button type="button" className="btn-back" onClick={() => setStep(1)} disabled={loading}>
                Go Back
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}