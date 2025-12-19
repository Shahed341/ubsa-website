import React from 'react';
import TigerHero from '../components/TigerHero';
import Gallery from './Gallery'; // Importing your Gallery page

export default function Home() {
  return (
    <>
      {/* 1. Hero Animation Section */}
      <TigerHero />

      {/* 2. Gallery Section (Appears after scrolling past the Tiger) */}
      <div style={{ position: 'relative', zIndex: 10, background: '#001d1d' }}>
        <Gallery />
      </div>
    </>
  );
}