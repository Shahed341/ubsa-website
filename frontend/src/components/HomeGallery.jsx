import React from 'react';
import { Link } from 'react-router-dom';
import '../style/HomeGallery.css';

// Placeholder images - replace with your actual best photos later
const galleryImages = [
  "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517457373258-064077be8d55?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
];

export default function HomeGallery() {
  return (
    <section className="home-gallery-section">
      
      {/* 1. Big Centered Title (Matches your theme) */}
      <h2 className="home-gallery-title">Photo Gallery Highlights</h2>

      {/* 2. The Expanding Glass Gallery Container */}
      <div className="gallery-flex-container">
        {galleryImages.map((imgUrl, index) => (
          // These divs act as the expanding "Glass Columns"
          <div key={index} className="gallery-glass-col" style={{ '--bg-img': `url(${imgUrl})` }}>
            <div className="col-content">
              {/* Optional: Add text or icons here that only show on hover */}
            </div>
          </div>
        ))}
      </div>

      {/* 3. "See All" Glass Button (Red on Hover) */}
      <div className="gallery-btn-container">
        <Link to="/gallery" className="view-gallery-btn">
          See All Photos →
        </Link>
      </div>

    </section>
  );
}