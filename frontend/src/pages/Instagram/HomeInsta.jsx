import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPlay, FaClone, FaHeart, FaComment, FaTimes, FaShareAlt } from 'react-icons/fa';
import '../../style/HomeInsta.css';
import TigerBG from '../../assets/ContactPageBG.png'; 

export default function HomeInsta() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchInstagram = async () => {
      try {
        const response = await fetch('https://feeds.behold.so/z5VUXCiRkFNeOU6nuCnF');
        const data = await response.json();
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

  if (loading) return <div className="hins-spinner"></div>;

  return (
    <section className="hins-section" style={{ '--tiger-bg': `url(${TigerBG})` }}>
      {/* Shared Parallax Background Logic */}
      <div className="hins-fixed-bg"></div>
      <div className="hins-overlay-tint"></div>

      <div className="hins-glass-wrapper">
        <div className="hins-header">
          <div className="hins-logo-ring">
            <div className="hins-logo-inner">
              <FaInstagram className="hins-main-icon" />
            </div>
          </div>
          <div className="hins-brand-meta">
            <h2>ubsa.usask</h2>
            <p>Bengali Student Association • U of S</p>
          </div>
        </div>

        {/* 3x3 Grid with Fixed Spacing */}
        <div className="hins-grid-container">
          {posts.map((post) => (
            <div key={post.id} className="hins-tile" onClick={() => setSelectedPost(post)}>
              <div className="hins-tile-media">
                <img 
                  src={post.mediaType === "VIDEO" ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl} 
                  alt="UBSA Social" 
                />
              </div>
              <div className="hins-indicator">
                {post.mediaType === "VIDEO" && <FaPlay />}
                {post.mediaType === "CAROUSEL_ALBUM" && <FaClone />}
              </div>
            </div>
          ))}
        </div>

        <div className="hins-footer">
          <a href="https://www.instagram.com/ubsa.usask/" target="_blank" rel="noreferrer" className="hins-pill-btn">
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* ISOLATED MODAL VIEW */}
      {selectedPost && (
        <div className="hins-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="hins-modal-box" onClick={e => e.stopPropagation()}>
            <button className="hins-close-x" onClick={() => setSelectedPost(null)}>
              <FaTimes />
            </button>

            <div className="hins-modal-left">
              {selectedPost.mediaType === "VIDEO" ? (
                <video src={selectedPost.mediaUrl} controls autoPlay loop />
              ) : (
                <img src={selectedPost.mediaUrl} alt="Post Detail" />
              )}
            </div>

            <div className="hins-modal-right">
              <div className="hins-user-row">
                <div className="hins-avatar-mini">U</div>
                <div className="hins-user-info">
                   <strong>ubsa.usask</strong>
                   <span>Saskatoon, SK</span>
                </div>
              </div>

              <div className="hins-caption-scroll">
                <p><strong>ubsa.usask</strong> {selectedPost.caption || "No caption available."}</p>
              </div>

              <div className="hins-stats-bar">
                 <div className="hins-stat"><FaHeart /> <span>{Math.floor(Math.random() * 200) + 50}</span></div>
                 <div className="hins-stat"><FaComment /> <span>{Math.floor(Math.random() * 20) + 5}</span></div>
                 <div className="hins-stat"><FaShareAlt /></div>
              </div>

              <a href={selectedPost.permalink} target="_blank" rel="noreferrer" className="hins-ext-link">
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}