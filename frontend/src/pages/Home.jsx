import React from 'react';
import TigerHero from '../components/TigerHero';
// Import the new component
import HomeGallery from '../components/HomeGallery'; 
import Events from './Events'; 

export default function Home() {
  return (
    <>
      <TigerHero />

      {/* Main Content Wrapper (White background) */}
      <div style={{ position: 'relative', zIndex: 10, background: '#ffffff' }}>
        
        {/* Events Section */}
        <Events isHome={true} />
        
        {/* --- NEW GALLERY SECTION --- */}
        {/* The component itself handles its dark background */}
        <HomeGallery />

        {/* (You can remove the old Gallery import if you aren't using it anymore) */}
        {/* <Gallery /> */}
        
      </div>
    </>
  );
}