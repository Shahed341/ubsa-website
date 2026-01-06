import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/HomeGallery.css';

export default function HomeGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // We'll fix the middle item (index 2) as the "expanded" one for a premium look
  const expandedIndex = 2; 

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery/photos')
      .then(res => res.json())
      .then(data => {
        // We need at least 5 images for this to look right
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching homepage gallery:", err);
        setLoading(false);
      });
  }, []);

  // 1-Second Sliding Logic
  useEffect(() => {
    if (images.length > 5) {
      const interval = setInterval(() => {
        setImages((prevImages) => {
          // Take the first image and move it to the end
          const [first, ...rest] = prevImages;
          return [...rest, first];
        });
      }, 2000); // 2 seconds feels better for a slide + expand animation

      return () => clearInterval(interval);
    }
  }, [images]);

  const getFullImgPath = (src) => {
    return src.startsWith('http') ? src : `http://localhost:5000${src}`;
  };

  if (loading) return null;

  if (images.length === 0) {
    return (
      <section className="home-gallery-section">
        <h2 className="home-gallery-title">Photo Gallery Highlights</h2>
        <div style={{ padding: '3rem', color: '#ccc', fontStyle: 'italic' }}>
          <p>No photos uploaded yet. Check back soon!</p>
        </div>
        <div className="gallery-btn-container">
          <Link to="/gallery" className="view-gallery-btn">See All Photos →</Link>
        </div>
      </section>
    );
  }

  // Only render the first 5 images of the current rotated array
  const visibleImages = images.slice(0, 5);

  return (
    <section className="home-gallery-section">
      <h2 className="home-gallery-title">Photo Gallery Highlights</h2>

      <div className="gallery-flex-container">
        {visibleImages.map((img, index) => (
          <div 
            key={img.id} 
            // The middle image (index 2) is always the expanded one
            className={`gallery-glass-col ${index === expandedIndex ? 'active' : ''}`} 
            style={{ '--bg-img': `url(${getFullImgPath(img.src)})` }}
          >
            <div className="col-content"></div>
          </div>
        ))}
      </div>

      <div className="gallery-btn-container">
        <Link to="/gallery" className="view-gallery-btn">
          See All Photos →
        </Link>
      </div>
    </section>
  );
}