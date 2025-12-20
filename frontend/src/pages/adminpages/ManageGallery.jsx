import React, { useState, useEffect } from 'react';
import '../../style/adminpages/ManageGallery.css'; 

export default function ManageGallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null); // Store the selected file
  const [category, setCategory] = useState('Festivals');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');

  // 1. Fetch Existing Photos
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = () => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error("Error fetching gallery:", err));
  };

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 3. Submit Form (Using FormData for File Upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select an image file.");
      return;
    }

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('image', file); // 'image' matches upload.single('image') in backend
    formData.append('category', category);
    formData.append('caption', caption);

    try {
      const res = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        body: formData, // No Content-Type header needed, fetch sets it automatically for FormData
      });

      if (res.ok) {
        setStatus('Photo Uploaded Successfully!');
        setFile(null);
        setCaption('');
        setCategory('Festivals');
        // Reset file input visually
        document.getElementById('fileInput').value = ""; 
        fetchPhotos();
      } else {
        setStatus('Error uploading photo.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Server error.');
    }
  };

  // 4. Delete Photo
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPhotos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-gallery-container">
      <h1 className="admin-title">Manage Gallery</h1>

      {/* --- ADD PHOTO FORM --- */}
      <div className="admin-card add-photo-section">
        <h2>Upload New Photo</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          
          {/* File Input */}
          <div className="form-group full-width">
            <label>Select Image</label>
            <input 
              id="fileInput"
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              required 
              className="file-input-glass"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Festivals">Festivals</option>
              <option value="Community">Community</option>
              <option value="Sports">Sports</option>
              <option value="Events">Events</option>
            </select>
          </div>

          {/* Caption - BIGGER TEXT AREA */}
          <div className="form-group full-width">
            <label>Caption</label>
            <textarea 
              rows="4"
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              placeholder="Write a description..." 
              required 
            />
          </div>

          <button type="submit" className="admin-btn add-btn">Upload Photo</button>
          {status && <p className="status-msg">{status}</p>}
        </form>
      </div>

      {/* --- EXISTING PHOTOS GRID --- */}
      <div className="admin-card list-photo-section">
        <h2>Existing Photos</h2>
        <div className="admin-gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="admin-photo-card">
              <img src={photo.src} alt={photo.caption} />
              <div className="admin-photo-info">
                <span className="badge">{photo.category}</span>
                <p>{photo.caption}</p>
                <button 
                  className="admin-btn delete-btn" 
                  onClick={() => handleDelete(photo.id)}
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}