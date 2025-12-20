import React, { useState, useEffect } from 'react';
import '../../style/adminpages/ManageGallery.css'; 

export default function ManageGallery() {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    src: '',
    category: 'Festivals',
    caption: ''
  });
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

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit New Photo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Adding...');

    try {
      const res = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('Photo Added Successfully!');
        setFormData({ src: '', category: 'Festivals', caption: '' }); // Reset form
        fetchPhotos(); // Refresh list
      } else {
        setStatus('Error adding photo.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Server error.');
    }
  };

  // 4. Delete Photo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPhotos(photos.filter(photo => photo.id !== id));
      } else {
        alert("Failed to delete photo");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting photo");
    }
  };

  return (
    <div className="admin-gallery-container">
      <h1 className="admin-title">Manage Gallery</h1>

      {/* --- ADD PHOTO FORM --- */}
      <div className="admin-card add-photo-section">
        <h2>Add New Photo</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text" 
              name="src" 
              value={formData.src} 
              onChange={handleChange} 
              placeholder="https://example.com/image.jpg" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Festivals">Festivals</option>
              <option value="Community">Community</option>
              <option value="Sports">Sports</option>
              <option value="Events">Events</option>
            </select>
          </div>

          <div className="form-group">
            <label>Caption</label>
            <input 
              type="text" 
              name="caption" 
              value={formData.caption} 
              onChange={handleChange} 
              placeholder="e.g. Pohela Boishakh Celebration" 
              required 
            />
          </div>

          <button type="submit" className="admin-btn add-btn">Add Photo</button>
          {status && <p className="status-msg">{status}</p>}
        </form>
      </div>

      {/* --- EXISTING PHOTOS GRID --- */}
      <div className="admin-card list-photo-section">
        <h2>Existing Photos</h2>
        <div className="admin-gallery-grid">
          {photos.length === 0 ? (
            <p>No photos found. Add one above!</p>
          ) : (
            photos.map((photo) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}