import React, { useState, useEffect } from 'react';
import '../style/Gallery.css';
// Ensure this path matches exactly where your file is
import galleryBg from '../assets/TigerGalleryPageBG.jpg'; 

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Festivals', 'Community', 'Sports', 'Events'];

  // 1. Fetch Images from Backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching gallery:", err);
        setLoading(false);
      });
  }, []);

  // 2. Filter Logic
  const filteredImages = category === 'All' 
    ? images 
    : images.filter(img => img.category === category);

  return (
    // Pass the background image to CSS via variable
    <div className="gallery-page" style={{ '--gallery-bg': `url(${galleryBg})` }}>
      
      {/* Header */}
      <div className="gallery-header">
        <h1 className="page-title">
          Moments of <span className="text-highlight">Joy</span>
        </h1>
        <p className="page-subtitle">
          Snapshots from the UBSA community.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="gallery-filter">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {loading ? (
          <p style={{textAlign: 'center', width: '100%', fontStyle: 'italic'}}>Loading photos...</p>
        ) : filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <div 
              key={img.id} 
              className="gallery-item"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.src} alt={img.caption} loading="lazy" />
              <div className="image-overlay">
                <span>{img.caption}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', width: '100%'}}>No photos found in this category.</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.caption} />
            <p className="lightbox-caption">{selectedImage.caption}</p>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}

    </div>
  );
}