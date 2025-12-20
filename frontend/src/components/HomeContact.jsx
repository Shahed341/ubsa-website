import React, { useState } from 'react';
import '../style/HomeContact.css';

export default function HomeContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will be in touch shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="home-contact-section">
      <div className="home-contact-container">
        
        <div className="contact-glass-card">
          <div className="contact-text-col">
            <h2 className="section-title-home">Get in <span className="highlight">Touch</span></h2>
            <p className="section-subtitle">
              Have a question or want to join UBSA? Drop us a message below.
            </p>
            <div className="quick-info">
              <p>📍 Place Riel Student Centre</p>
              <p>📧 ubsa.usask@gmail.com</p>
            </div>
          </div>

          <div className="contact-form-col">
            <form onSubmit={handleSubmit}>
              <div className="form-group-home">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group-home">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group-home">
                <textarea 
                  name="message" 
                  rows="4" 
                  placeholder="Your Message..." 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              <button type="submit" className="btn-send-home">Send Message</button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}