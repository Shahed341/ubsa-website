import React, { useState, useEffect } from 'react';
import { FaCameraRetro, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import '../../style/adminpages/ManageGallery.css'; 

export default function ManageGallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Festivals');
  const [status, setStatus] = useState('');

  const categories = ['Festivals', 'Community', 'Sports', 'Events'];

  useEffect(() => { 
    fetchPhotos(); 
  }, []);

  // FIXED: Updated endpoint to /api/gallery/photos
  const fetchPhotos = () => {
    fetch('http://localhost:5000/api/gallery/photos')
      .then(res => {
        if (!res.ok) throw new Error("Server returned 404/500");
        return res.json();
      })
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching gallery:", err);
        setPhotos([]);
      });
  };

  // Helper to count photos by category
  const getCategoryCount = (cat) => photos.filter(p => p.category === cat).length;

  const handleFileChange = (e) => { setFile(e.target.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Please select an image.");

    setStatus('Uploading...');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    try {
      // FIXED: Updated endpoint to /api/gallery/photos
      const res = await fetch('http://localhost:5000/api/gallery/photos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setStatus('✅ Uploaded Successfully!');
        setFile(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = ""; 
        fetchPhotos();
      } else {
        setStatus('❌ Upload failed.');
      }
    } catch (err) { 
        setStatus('Server error.'); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      // FIXED: Updated endpoint to /api/gallery/photos
      const res = await fetch(`http://localhost:5000/api/gallery/photos/${id}`, { 
        method: 'DELETE' 
      });
      if (res.ok) fetchPhotos();
    } catch (err) { 
        console.error(err); 
    }
  };

  return (
    <div className="gallery-integrated-view">
      <div className="gallery-page-header">
        <div className="header-text">
          <h2><FaCameraRetro /> Gallery Manager</h2>
          <p>Organize and update the visual memories of UBSA.</p>
        </div>
      </div>

      <div className="gallery-stats-grid">
        {categories.map(cat => (
          <div key={cat} className="category-stat-card">
            <span className="cat-label">{cat}</span>
            <span className="cat-value">{getCategoryCount(cat)}</span>
            <div className="cat-progress-bg">
                <div 
                  className="cat-progress-fill" 
                  style={{ 
                    // ADDED: Prevent NaN errors if photos.length is 0
                    width: photos.length > 0 
                      ? `${(getCategoryCount(cat) / photos.length) * 100}%` 
                      : '0%' 
                  }}
                ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-main-layout">
        {/* LEFT: UPLOAD FORM */}
        <div className="glass-card upload-section">
          <h3><FaCloudUploadAlt /> New Upload</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Target Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Media Selection</label>
              <div className="file-drop-area">
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} required />
                <p>{file ? file.name : "Click to browse or drop image"}</p>
              </div>
            </div>

            <button type="submit" className="broadcast-action-btn">Deploy to Gallery</button>
            {status && <p className="status-msg-gallery">{status}</p>}
          </form>
        </div>

        {/* RIGHT: PHOTO PREVIEW GRID */}
        <div className="gallery-list-viewport">
          <div className="gallery-preview-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="gallery-item-card">
                <img src={photo.src} alt="Gallery" />
                <div className="gallery-item-overlay">
                  <span className="badge-mini">{photo.category}</span>
                  <button onClick={() => handleDelete(photo.id)} className="delete-icon-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}