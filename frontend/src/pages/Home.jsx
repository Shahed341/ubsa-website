import React from 'react';
import TigerHero from '../components/TigerHero';
import Gallery from './Gallery';
import Events from './Events'; 

export default function Home() {
  return (
    <>
      <TigerHero />

      {/* Main Content Wrapper */}
      {/* Changed background to '#ffffff' (White) */}
      <div style={{ position: 'relative', zIndex: 10, background: '#ffffff' }}>
        
        {/* Events Section (Will auto-adapt colors via CSS) */}
        <Events isHome={true} />

        {/* Gallery Section */}
        <Gallery />
        
      </div>
    </>
  );
}