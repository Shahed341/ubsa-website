import React, { useState, useEffect } from 'react';
import { FaPlay, FaVideo } from 'react-icons/fa';
import "../../style/GalleryVideo.css";

export default function GalleryVideo() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FETCHING DIRECTLY FROM THE NEW VIDEOS ENDPOINT
    fetch('http://localhost:5000/api/gallery/videos')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setVideos(data);
        // Automatically feature the first video from the DB results
        if (data.length > 0) setSelectedVideo(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error pulling videos from database:", err);
        setLoading(false);
      });
  }, []);

  /**
   * Transforms standard YouTube URLs into embeddable format.
   * Pulls the 'url' column value directly from the DB.
   */
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    
    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` 
      : url;
  };

  /**
   * Resolves the thumbnail to display in the playlist.
   * Priority: 
   * 1. Manually uploaded 'thumbnail' path from DB.
   * 2. Auto-generated YouTube thumbnail if no manual upload exists.
   */
  const resolveThumbnail = (vid) => {
    if (vid.thumbnail) return vid.thumbnail;
    
    // Fallback logic for YouTube links stored in DB
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = vid.url.match(regExp);
    return match && match[2].length === 11 
      ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` 
      : "https://placehold.co/600x400?text=No+Thumbnail+Found";
  };

  if (loading) return (
    <div className="video-loader-container">
      <div className="loader-neon-circle"></div>
      <p>Loading Cinematic Database...</p>
    </div>
  );

  return (
    <div className="video-gallery-section">
      <div className="video-content-wrapper">
        <div className="video-header">
          <h1 className="video-title">
            <FaVideo className="title-icon" />
            Cinematic <span className="text-highlight">UBSA</span>
          </h1>
          <p className="video-subtitle">Video Content Pulled Directly from UBSA Records</p>
        </div>

        {/* FEATURED PLAYER SECTION */}
        {selectedVideo && (
          <div className="featured-video-glow-wrapper">
            <div className="snake-light red-snake"></div>
            <div className="snake-light green-snake"></div>
            
            <div className="featured-video-container">
              <iframe
                src={getEmbedUrl(selectedVideo.url)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-info-overlay">
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description}</p>
                <span className="info-category-tag">{selectedVideo.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* PLAYLIST GRID SECTION */}
        <div className="video-grid-section">
          <div className="grid-label"><span>Database Playlist</span></div>
          <div className="video-grid">
            {videos.map((vid) => (
              <div 
                key={vid.id} 
                className={`video-card ${selectedVideo?.id === vid.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedVideo(vid);
                  // Scroll view to focus on the main player
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              >
                <div className="thumb-wrapper">
                  <img src={resolveThumbnail(vid)} alt={vid.title} />
                  <div className="play-hint"><FaPlay /></div>
                </div>
                <div className="vid-card-body">
                  <h4>{vid.title}</h4>
                  <div className="vid-card-footer">
                    <span className="vid-tag">{vid.category}</span>
                    <span className="vid-date">{new Date(vid.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}