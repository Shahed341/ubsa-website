import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../style/HomeGallery.css';

// Importing local team assets
import AbirKhan from '../assets/Team/Abir_Khan.png';
import IshratMaya from '../assets/Team/Ishrat_Maya.png';
import MohammedKhan from '../assets/Team/Mohammed_Khan.png';
import NusratAhona from '../assets/Team/Nusrat_Ahona.png';
import RabAhmed from '../assets/Team/Rab_Ahmed_Rwna.png';
import RodoshyPrithibi from '../assets/Team/Rodoshy_Prithibi.png';
import RubanaSayeda from '../assets/Team/Rubana_Sayeda.png';

const LOCAL_PLACEHOLDERS = [
  { id: 'l1', src: AbirKhan, isLocal: true },
  { id: 'l2', src: IshratMaya, isLocal: true },
  { id: 'l3', src: MohammedKhan, isLocal: true },
  { id: 'l4', src: NusratAhona, isLocal: true },
  { id: 'l5', src: RabAhmed, isLocal: true },
  { id: 'l6', src: RodoshyPrithibi, isLocal: true },
  { id: 'l7', src: RubanaSayeda, isLocal: true },
];

export default function HomeGallery() {
  const [images, setImages] = useState(LOCAL_PLACEHOLDERS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Data with fallback to LOCAL_PLACEHOLDERS
  useEffect(() => {
    fetch('http://localhost:5000/api/gallery/photos')
      .then(res => res.json())
      .then(data => {
        // Only override if we get a valid array from DB
        if (data && Array.isArray(data) && data.length >= 5) {
          setImages(data.map(img => ({ ...img, isLocal: false })));
        }
      })
      .catch(() => console.log("DB Offline: Showing Local Demo Pics"));
  }, []);

  // 2. The Push-Logic Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Wait for CSS Animation (1000ms) before swapping array order
      setTimeout(() => {
        setImages((prev) => {
          const updated = [...prev];
          const first = updated.shift();
          updated.push(first);
          return updated;
        });
        setIsTransitioning(false);
      }, 1000); 

    }, 4500); // 3.5s pause + 1s movement

    return () => clearInterval(interval);
  }, [images.length]);

  const getFullImgPath = (img) => {
    if (img.isLocal) return img.src;
    return img.src.startsWith('http') ? img.src : `http://localhost:5000${img.src}`;
  };

  return (
    <section className="home-gallery-section">
      <div className="home-gallery-content">
        <h2 className="home-gallery-title">
          UBSA <span className="highlight">Moments</span>
        </h2>

        {/* Viewport limits visibility to 5 items */}
        <div className="gallery-stage-viewport">
          <div className={`gallery-flex-container ${isTransitioning ? 'stage-transition' : ''}`}>
            {/* Slice 7 to have an 'exit' node and an 'entry' node ready */}
            {images.slice(0, 7).map((img, index) => {
              let columnClass = "gallery-glass-col";

              // Logic for 5 visible photos (indices 1 to 5)
              // index 0: The one sliding out left (Exiting)
              // index 3: The center featured one (Active)
              // index 4: The one about to become featured (Next Active)
              // index 6: The one sliding in from right (Entering)
              
              if (index === 0) columnClass += " exiting-node";
              if (index === 3) columnClass += " current-active";
              if (index === 4) columnClass += " next-active";
              if (index === 6) columnClass += " entering-node";

              return (
                <div 
                  key={`${img.id}-${index}`} 
                  className={columnClass} 
                  style={{ backgroundImage: `url(${getFullImgPath(img)})` }}
                  onClick={() => navigate('/gallery')}
                >
                  <div className="glass-inner-overlay"></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="gallery-btn-container">
          <button className="view-gallery-btn" onClick={() => navigate('/gallery')}>
            Explore Gallery <FaArrowRight style={{ marginLeft: '12px' }} />
          </button>
        </div>
      </div>
    </section>
  );
}