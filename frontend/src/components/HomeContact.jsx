import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelopeOpenText, FaPaperPlane } from 'react-icons/fa';
import '../style/HomeContact.css';
import TigerBG from '../assets/ContactPageBG.png'; 

export default function HomeContact() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', subject: 'General Inquiry', message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hcon-section" style={{ '--tiger-bg': `url(${TigerBG})` }}>
      {/* Shared Parallax Background Layers */}
      <div className="hcon-fixed-bg"></div>
      <div className="hcon-overlay-tint"></div>

      <div className="hcon-container">
        <div className="hcon-glass-card">
          
          {/* Left Half: Details */}
          <div className="hcon-details-side">
            <h2 className="hcon-title">Get in <span className="hcon-highlight">Touch</span></h2>
            <p className="hcon-subtitle">Drop us a message and we'll get back to you shortly.</p>
            
            <div className="hcon-info-stack">
              <div className="hcon-info-item">
                <div className="hcon-icon-box"><FaMapMarkerAlt /></div>
                <div className="hcon-info-text">
                   <strong>Location</strong>
                   <p>Place Riel Student Centre</p>
                </div>
              </div>
              <div className="hcon-info-item">
                <div className="hcon-icon-box"><FaEnvelopeOpenText /></div>
                <div className="hcon-info-text">
                   <strong>Email</strong>
                   <p>ubsa.usask@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Half: Form Fields */}
          <div className="hcon-form-side">
            <form onSubmit={handleSubmit} className="hcon-form">
              <div className="hcon-input-group">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="hcon-input-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="hcon-input-group">
                <textarea name="message" rows="3" placeholder="Your Message..." value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="hcon-btn-pop" disabled={isSubmitting}>
                {isSubmitting ? '...' : <>Send Message <FaPaperPlane style={{marginLeft: '8px'}}/></>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}