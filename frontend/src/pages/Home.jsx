import React from 'react';
import TigerHero from '../components/TigerHero';
import HomeGallery from '../components/HomeGallery'; 
import HomeSponsors from '../components/HomeSponsors';
import HomeContact from '../components/HomeContact';
import HomeEvents from '../components/HomeEvernts';

export default function Home() {
  return (
    <div className="home-container">
      <TigerHero />

      <div style={{ position: 'relative', zIndex: 10, background: '#000' }}>
        
        {/* 1. Events */}
        <HomeEvents />
        
        {/* 2. Gallery */}
        <HomeGallery />

        {/* 3. Sponsors */}
        <HomeSponsors />

        {/* 4. Contact Form */}
        <HomeContact />

      </div>
    </div>
  );
}
