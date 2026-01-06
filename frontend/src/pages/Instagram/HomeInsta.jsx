import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPlay, FaClone, FaHeart, FaComment, FaTimes, FaShareAlt } from 'react-icons/fa';
import '../../style/HomeInsta.css';
import TigerBG from '../../assets/TigerGalleryPageBG.jpg'; 

export default function HomeInsta() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchInstagram = async () => {
      try {
        const response = await fetch('https://feeds.behold.so/z5VUXCiRkFNeOU6nuCnF');
        const data = await response.json();
        // Accessing the posts array from the provided JSON structure
        const postData = data.posts ? data.posts : data;
        setPosts(postData.slice(0, 9)); 
        setLoading(false);
      } catch (err) {
        console.error("Insta Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchInstagram();
  }, []);

  if (loading) return <div className="insta-loading-spinner"></div>;

  return (
    <section className="insta-dynamic-section" style={{ '--tiger-bg': `url(${TigerBG})` }}>
      {/* Dynamic Background Layers */}
      <div className="insta-fixed-bg"></div>
      <div className="insta-theme-overlay"></div>

      {/* Floating 5% Frosted Glass Card */}
      <div className="insta-glass-card-container">
        <div className="insta-header-centered">
          <div className="insta-gradient-ring">
            <div className="insta-avatar-inner">
              <FaInstagram className="insta-icon-top" />
            </div>
          </div>
          <div className="insta-brand-info">
            <h2>ubsa.usask</h2>
            <p>Bengali Student Association • U of S</p>
          </div>
        </div>

        {/* 3x3 Dynamic Grid */}
        <div className="insta-3x3-responsive-grid">
          {posts.map((post) => (
            <div key={post.id} className="insta-grid-item" onClick={() => setSelectedPost(post)}>
              <div className="img-zoom-container">
                <img 
                  src={post.mediaType === "VIDEO" ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl} 
                  alt="UBSA Insta" 
                />
              </div>
              <div className="tile-indicator-box">
                {post.mediaType === "VIDEO" && <FaPlay />}
                {post.mediaType === "CAROUSEL_ALBUM" && <FaClone />}
              </div>
            </div>
          ))}
        </div>

        <div className="insta-cta-centered">
          <a href="https://www.instagram.com/ubsa.usask/" target="_blank" rel="noreferrer" className="insta-pill-btn">
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* ENHANCED MODAL VIEW */}
      {selectedPost && (
        <div className="insta-custom-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="insta-modal-inner-box" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button className="modal-close-x" onClick={() => setSelectedPost(null)}>
              <FaTimes />
            </button>

            <div className="modal-left-media">
              {selectedPost.mediaType === "VIDEO" ? (
                <video src={selectedPost.mediaUrl} controls autoPlay loop />
              ) : (
                <img src={selectedPost.mediaUrl} alt="Instagram Post" />
              )}
            </div>

            <div className="modal-right-details">
              <div className="modal-profile-top">
                <div className="avatar-u-mini">U</div>
                <div className="user-name-stack">
                   <strong>ubsa.usask</strong>
                   <span>Saskatoon, SK</span>
                </div>
              </div>

              <div className="modal-caption-area">
                <p><strong>ubsa.usask</strong> {selectedPost.caption || "No caption available."}</p>
              </div>

              <div className="modal-engagement-row">
                 <div className="stat-item"><FaHeart /> <span>{Math.floor(Math.random() * 200) + 50}</span></div>
                 <div className="stat-item"><FaComment /> <span>{Math.floor(Math.random() * 20) + 5}</span></div>
                 <div className="stat-item"><FaShareAlt /></div>
              </div>

              <a href={selectedPost.permalink} target="_blank" rel="noreferrer" className="modal-external-link">
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}