import React, { useState } from 'react';
import {
  FaTimes,
  FaMoneyBillWave,
  FaUniversity,
  FaMapMarkerAlt,
  FaStore,
  FaTag,
  FaEnvelope,
  FaInfoCircle
} from 'react-icons/fa';
import '../style/SponsorForm.css';

export default function SponsorFormModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    location: '',
    description: '',
    discount_title: '',
    tier: 'Silver',
    payment_type: 'E-Transfer',
    contact_person: 'Web Submission'
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      alert('Application submitted successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error');
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

        <h2>{step === 1 ? 'Partner with UBSA' : 'Sponsorship Details'}</h2>
        <p className="step-indicator">Step {step} of 2</p>

        <form onSubmit={step === 1 ? nextStep : submitForm}>
          {step === 1 && (
            <>
              <div className="form-group-modal">
                <label><FaStore /> Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-modal">
                <label><FaMapMarkerAlt /> Business Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-modal">
                <label><FaEnvelope /> Contact Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-modal">
                <label><FaInfoCircle /> Business Description *</label>
                <textarea
                  name="description"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-modal">
                <label><FaTag /> Member Discount (Optional)</label>
                <input
                  type="text"
                  name="discount_title"
                  value={formData.discount_title}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-next">
                Next: Contribution
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group-modal">
                <label>Select Sponsorship Tier</label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
                >
                  <option value="Bronze">Bronze ($50+)</option>
                  <option value="Silver">Silver ($100+)</option>
                  <option value="Gold">Gold ($250+)</option>
                  <option value="Platinum">Platinum ($500+)</option>
                </select>
              </div>

              <p className="payment-instruction">Payment Method</p>

              <div
                className={`pay-option ${formData.payment_type === 'E-Transfer' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, payment_type: 'E-Transfer' })}
              >
                <FaMoneyBillWave />
                <div className="pay-text">
                  <span>E-Transfer</span>
                  <small>Fast & secure digital transfer</small>
                </div>
              </div>

              <div
                className={`pay-option ${formData.payment_type === 'Cheque' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, payment_type: 'Cheque' })}
              >
                <FaUniversity />
                <div className="pay-text">
                  <span>Cheque / Invoice</span>
                  <small>Business cheque or invoice</small>
                </div>
              </div>

              <button type="submit" className="btn-final" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>

              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Go Back
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
