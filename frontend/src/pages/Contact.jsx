import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import '../style/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you! Your message has been sent to the UBSA Admin Inbox.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Oops! Our system is currently offline. Please try emailing us directly at ubsa.usask@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* --- HERO SECTION --- */}
      <header className="contact-hero">
        <h1 className="page-title">Get in <span className="text-highlight">Touch</span></h1>
        <p className="page-subtitle">
          Have questions about membership, events, or sponsorships? We'd love to hear from you.
        </p>
      </header>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="contact-container">
        
        {/* LEFT COLUMN: INFO */}
        <div className="contact-info-card glass-panel">
          <h2>Contact Information</h2>
          <p className="info-intro">Find us on campus or reach out digitally.</p>
          
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h3>Visit Us</h3>
              <p>Place Riel Student Centre</p>
              <p>University of Saskatchewan</p>
              <p>Saskatoon, SK</p>
            </div>
          </div>

          <div className="info-item">
            <FaEnvelope className="icon" />
            <div>
              <h3>Email Us</h3>
              <a href="mailto:ubsa.usask@gmail.com">ubsa.usask@gmail.com</a>
            </div>
          </div>

          <div className="social-connect">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61569283955219" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/ubsa.usask/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="contact-form-card glass-panel">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Your Name"
                required 
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="your.email@example.com"
                required 
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="" disabled>Select a topic</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Membership">Membership</option>
                <option value="Sponsorship">Sponsorship</option>
                <option value="Events">Events</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}