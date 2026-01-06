import React from 'react';
import TigerHero from '../components/TigerHero';
import HomeGallery from '../components/HomeGallery'; 
import HomeSponsors from '../components/HomeSponsors';
import HomeContact from '../components/HomeContact';
import HomeEvents from '../components/HomeEvernts';
import HomeInsta from '../pages/Instagram/HomeInsta';

export default function Home() {
  return (
    <div className="home-container">
      <TigerHero />

      // In Home.jsx, change the style of the wrapper div:
      <div style={{ position: 'relative', zIndex: 10, background: '#001a1a' }}>
        
        {/* 1. Events */}
        <HomeEvents />
        
        {/* 2. Gallery */}
        <HomeGallery />

        {/* 3. Sponsors */}
        <HomeSponsors />

        {/* 4. Instagram Feed */}
        <HomeInsta />

        {/* 4. Contact Form */}
        <HomeContact />

      </div>
    </div>
  );
}
