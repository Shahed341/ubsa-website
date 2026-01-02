import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../style/Gallery.css';
import galleryBg from '../assets/TigerGalleryPageBG.jpg';

// 1. IMPORT THE VIDEO COMPONENT

import GalleryVideo from '../components/gallery/GalleryVideo';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [showGrid, setShowGrid] = useState(false);
  
  const gridRef = useRef(null);
  const categories = ['All', 'Festivals', 'Community', 'Sports', 'Events'];

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        const initial = data.filter(img => category === 'All' || img.category === category);
        setDisplayImages(initial);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching gallery:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = category === 'All' 
      ? images 
      : images.filter(img => img.category === category);
    setDisplayImages(filtered);
  }, [category, images]);

  const moveNext = () => {
    setDisplayImages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const first = updated.shift();
      updated.push(first);
      return updated;
    });
  };

  const movePrev = () => {
    setDisplayImages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated.pop();
      updated.unshift(last);
      return updated;
    });
  };

  useEffect(() => {
    if (displayImages.length < 2) return;
    const timer = setInterval(moveNext, 4000);
    return () => clearInterval(timer);
  }, [displayImages]);

  // 2. UPDATED TOGGLE: Scrolls to the end of the page when expanded
  const handleGridToggle = () => {
    if (showGrid) {
      setShowGrid(false);
    } else {
      setShowGrid(true);
      setTimeout(() => {
        // Scrolls to the very bottom of the document
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
    }
  };

  return (
    <div className="gallery-page" style={{ '--gallery-bg': `url(${galleryBg})` }}>
      <div className="gallery-header">
        <h1 className="page-title">
          Moments of <span className="text-highlight">Joy</span>
        </h1>
      </div>

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

      <div className="carousel-view-section">
        <div className="carousel-container">
          {loading ? (
            <p className="status-text">Loading community moments...</p>
          ) : (
            <div className="carousel-track">
              <button className="nav-btn left" onClick={movePrev}><FaChevronLeft /></button>
              <div className="slider-wrapper">
                {displayImages.map((img, index) => {
                  let position = "hidden";
                  if (index === 0) position = "center";
                  else if (index === 1) position = "right-1";
                  else if (index === 2) position = "right-2";
                  else if (index === displayImages.length - 1) position = "left-1";
                  else if (index === displayImages.length - 2) position = "left-2";

                  return (
                    <div key={img.id} className={`carousel-card ${position}`}>
                      <img src={img.src} alt={img.caption} />
                      {position === "center" && (
                        <div className="carousel-info-overlay">
                          <h3>{img.caption}</h3>
                          <p>{img.category}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className="nav-btn right" onClick={moveNext}><FaChevronRight /></button>
            </div>
          )}
        </div>

        <div className="scroll-indicator-wrapper">
            <div className="scroll-indicator" onClick={handleGridToggle}>
              <span>{showGrid ? "Hide Photo Grid" : "Explore Photo Grid"}</span>
              {showGrid ? <FaChevronUp className="bounce-arrow" /> : <FaChevronDown className="bounce-arrow" />}
            </div>
        </div>
      </div>

      {/* 3. VIDEO SECTION INSERTED HERE */}
      <hr className="section-divider" />
      <GalleryVideo />

      {/* 4. PHOTO GRID AT THE VERY END */}
      {showGrid && (
        <div className="gallery-grid-section" ref={gridRef}>
          <div className="grid-header-line">
            <span>Full Photo Collection</span>
          </div>
          <div className="gallery-grid">
            {displayImages.map((img) => (
              <div key={img.id} className="grid-item">
                <img src={img.src} alt={img.caption} loading="lazy" />
                <div className="grid-overlay">
                  <p>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}