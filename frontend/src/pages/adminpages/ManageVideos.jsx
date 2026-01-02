import React, { useState, useEffect } from 'react';
import { FaVideo, FaTrash, FaPlus, FaYoutube, FaCloudUploadAlt } from 'react-icons/fa';
// Fixed the typo in the import path to match your actual file system
import '../../style/adminpages/ManageVideos.css';

export default function ManageVideos() {
  const [videos, setVideos] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Event'
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/gallery/videos');
      const data = await res.json();
      
      // CRITICAL FIX: Ensure data is an array before setting state
      // This prevents the ".map is not a function" error if the server returns an error object
      if (Array.isArray(data)) {
        setVideos(data);
      } else {
        console.error("Received non-array data:", data);
        setVideos([]);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Safe helper to get YouTube Thumbnail
   * Prevents crashes if the URL in the database is malformed
   */
  const getYTThumbnail = (url) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
      }
      return "https://placehold.co/100x60?text=Invalid+URL";
    } catch (e) {
      return "https://placehold.co/100x60?text=Error";
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const data = new FormData();
    data.append('title', formData.title);
    data.append('url', formData.url);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (thumbnail) data.append('videoThumbnail', thumbnail);

    try {
      const res = await fetch('http://localhost:5000/api/gallery/videos', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Video added to database!' });
        setFormData({ title: '', url: '', description: '', category: 'Event' });
        setThumbnail(null);
        fetchVideos();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Failed to add video.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Check if backend is running.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this video from the database?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/gallery/videos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== id));
      } else {
        alert("Failed to delete video from server.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="manage-videos-container">
      <div className="admin-page-header">
        <h2><FaVideo /> Video Content Manager</h2>
        <p>Link YouTube content and manage the cinematic gallery records.</p>
      </div>

      <div className="video-management-grid">
        {/* --- 1. ADD VIDEO FORM --- */}
        <div className="video-form-card">
          <h3><FaPlus /> Link New Video</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Video Title</label>
              <input 
                type="text" name="title" value={formData.title}
                onChange={handleInputChange} placeholder="e.g. UBSA Gala 2025 Highlights" required 
              />
            </div>

            <div className="form-group">
              <label><FaYoutube /> YouTube URL</label>
              <input 
                type="url" name="url" value={formData.url}
                onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." required 
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Event">Event</option>
                <option value="Highlights">Highlights</option>
                <option value="Interview">Interview</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" value={formData.description}
                onChange={handleInputChange} placeholder="Short description of the video..."
              />
            </div>

            <div className="form-group">
              <label>Custom Thumbnail (Optional)</label>
              <div className="file-input-wrapper">
                <FaCloudUploadAlt />
                <span>{thumbnail ? thumbnail.name : "Choose Image File"}</span>
                <input type="file" onChange={handleFileChange} accept="image/*" />
              </div>
            </div>

            <button type="submit" className="admin-submit-btn">Save to Database</button>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          </form>
        </div>

        {/* --- 2. VIDEO LIST --- */}
        <div className="video-list-card">
          <h3>Current Database Records</h3>
          {loading ? (
            <div className="loading-spinner-small">Loading records...</div>
          ) : (
            <div className="admin-video-list">
              {/* Added safe check for videos length */}
              {Array.isArray(videos) && videos.length > 0 ? (
                videos.map(vid => (
                  <div key={vid.id} className="admin-video-item">
                    <div className="vid-preview-thumb">
                      <img src={vid.thumbnail || getYTThumbnail(vid.url)} alt="thumb" />
                    </div>
                    <div className="vid-details">
                      <h4>{vid.title}</h4>
                      <span className="vid-tag">{vid.category}</span>
                    </div>
                    <button className="vid-delete-btn" onClick={() => handleDelete(vid.id)} title="Delete Video">
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty-msg">No videos found in database.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}