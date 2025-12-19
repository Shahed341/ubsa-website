import React, { useState } from 'react';
import '../style/Gallery.css';

// Using mock images for now so the page doesn't crash. 
// You can replace these URLs with your local imports later.
const MOCK_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1561058286-9a40579a1841?w=800", category: "Festivals", caption: "Pohela Boishakh Colors" },
  { id: 2, src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800", category: "Community", caption: "Community Gathering" },
  { id: 3, src: "https://images.unsplash.com/photo-1517135384666-88b14e59a72e?w=800", category: "Community", caption: "Annual Picnic" },
  { id: 4, src: "https://images.unsplash.com/photo-1626224583764-847890e05399?w=800", category: "Sports", caption: "Badminton Tournament" },
  { id: 5, src: "https://images.unsplash.com/photo-1604606774045-3bb7c2658a46?w=800", category: "Festivals", caption: "Cultural Night" },
  { id: 6, src: "https://images.unsplash.com/photo-1543503258-a239b9c92257?w=800", category: "Events", caption: "Freshers Reception" },
];

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Festivals', 'Community', 'Sports', 'Events'];

  const filteredImages = category === 'All' 
    ? MOCK_IMAGES 
    : MOCK_IMAGES.filter(img => img.category === category);

  return (
    <div className="gallery-page">
      
      {/* Header */}
      <div className="gallery-header">
        <h1 className="page-title">Moments of <span className="text-highlight">Joy</span></h1>
        <p className="page-subtitle">Snapshots from the UBSA community.</p>
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
        {filteredImages.map((img) => (
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
        ))}
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