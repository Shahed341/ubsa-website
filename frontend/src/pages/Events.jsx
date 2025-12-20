import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Events.css";

export default function Events({ isHome = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(e => {
      const d = new Date(e.date); d.setHours(0,0,0,0);
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const showUpcoming = isHome ? upcomingEvents.slice(0, 3) : upcomingEvents;

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  /* --- MODAL --- */
  const EventModal = ({ event, onClose }) => {
    if (!event) return null;
    return (
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-glass" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <div className="modal-content-wrapper">
            <div className="modal-details">
              <h2 className="modal-title">{event.title}</h2>
              <div className="modal-meta-row">
                <span className="meta-tag">📅 {formatDate(event.date).full}</span>
                {event.time && <span className="meta-tag">⏰ {event.time}</span>}
              </div>
              {event.location && <p className="modal-location">📍 {event.location}</p>}
              <div className="modal-description-scroll"><p>{event.description}</p></div>
            </div>
            <div className="modal-image-col">
              <img src={getImageUrl(event.image_url)} alt={event.title} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-text">Loading...</div>;

  return (
    <div className={`events-page ${isHome ? 'is-home' : ''}`}>
      {!isHome && (
        <div className="events-header">
          <h1 className="page-title">Our <span className="text-highlight">Gatherings</span></h1>
          <p className="page-subtitle">Celebrating culture, innovation, and community spirit.</p>
        </div>
      )}

      {/* SHOW UPCOMING EVENTS */}
      <section className="events-section">
        {/* BIG UPDATED TITLE */}
        <h2 className={isHome ? "home-section-title centered" : "section-title"}>
          {isHome ? "Upcoming UBSA Events" : "📅 Upcoming Events"}
        </h2>
        
        {showUpcoming.length > 0 ? (
          <div className="events-grid">
            {showUpcoming.map((event) => {
              const { month, day } = formatDate(event.date);
              return (
                <div key={event.id} className="event-card upcoming" onClick={() => setSelectedEvent(event)}>
                  <div className="card-image">
                    <img src={getImageUrl(event.image_url)} alt={event.title} />
                    <div className="date-badge">
                      <span className="month">{month}</span>
                      <span className="day">{day}</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span>{event.time || "All Day"}</span>
                      <span>{event.location || "TBA"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{textAlign:'center', fontStyle:'italic', opacity:0.8}}>
            No upcoming events at the moment.
          </p>
        )}

        {/* RED BUTTON */}
        {isHome && (
          <div className="view-all-container">
            <Link to="/events" className="view-all-btn">
              See All Events →
            </Link>
          </div>
        )}
      </section>

      {/* PAST EVENTS HIDDEN ON HOME */}
      {!isHome && (
         <div /> 
      )}

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}