import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaHistory,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaTimes
} from "react-icons/fa";
import "../style/Events.css";

// Shared Assets
import EventBG1 from "../assets/BD_Cultural_Elements/Event_BG.png";
import EventBG2 from "../assets/BD_Cultural_Elements/Event_BG_2.png";
import EventBG3 from "../assets/BD_Cultural_Elements/Event_BG_3.png";
import EventIcon from "../assets/BD_Cultural_Elements/Event_icon.png";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Modal scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedEvent ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedEvent]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);
  const pastEvents = events.filter((e) => new Date(e.date) < today);

  const getImageUrl = (url) =>
    url ? (url.startsWith("http") ? url : `http://localhost:5000${url}`) : "https://placehold.co/800x600";

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      day: d.getDate(),
      full: d.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      }),
    };
  };

  const EventModal = ({ event, onClose }) => (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        <div className="modal-content-wrapper">
          <div className="modal-image-col">
            <img src={getImageUrl(event.image_url)} alt={event.title} />
          </div>
          <div className="modal-details">
            <h2 className="modal-title">{event.title}</h2>
            <div className="modal-meta-row">
              <span className="meta-tag">
                <FaCalendarAlt className="icon-red" /> {formatDate(event.date).full}
              </span>
              {event.time && (
                <span className="meta-tag">
                  <FaClock className="icon-red" /> {event.time}
                </span>
              )}
              {event.location && (
                <span className="meta-tag">
                  <FaMapMarkerAlt className="icon-red" /> {event.location}
                </span>
              )}
            </div>
            <div className="modal-description-scroll">{event.description}</div>
            <div className="modal-actions">
              <Link to={`/events/${event.id}`} className="modal-register-btn">Register Now</Link>
              <span className="modal-price-tag">{event.price ? `$${event.price}` : "FREE"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="loading-container">
      <p className="loading-text">Loading Gatherings...</p>
    </div>
  );

  return (
    <div className="events-page">
      {/* ---------- ANIMATED BACKGROUND WITH GREEN TINT ---------- */}
      <div className="events-bg-container">
        <div className="events-bg-overlay-tint"></div>
        <div className="bg-row">
          <div className="marquee-track scroll-left">
            <img src={EventBG1} alt="" /><img src={EventBG1} alt="" />
          </div>
        </div>
        <div className="bg-row">
          <div className="marquee-track scroll-right">
            <img src={EventBG2} alt="" /><img src={EventBG2} alt="" />
          </div>
        </div>
        <div className="bg-row">
          <div className="marquee-track scroll-left">
            <img src={EventBG3} alt="" /><img src={EventBG3} alt="" />
          </div>
        </div>
      </div>

      <div className="events-content-wrapper">
        <div className="title-glass-container">
    <h1 className="events-page-title">
      {/* Custom Logo Icon Separated from Text */}
      <div className="title-icon-wrapper">
        <img src={EventIcon} alt="" className="title-custom-icon" />
      </div>
      <div className="title-text-wrapper">
        <span className="latest">Our </span>
        <span className="ubsa">Gatherings</span>
      </div>
    </h1>
  </div>

        {/* UPCOMING SECTION */}
        <section className="events-section">
          <h2 className="section-header">
            <FaCalendarAlt className="icon-red" /> Upcoming Events
          </h2>
          <div className="events-grid wide">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const { month, day } = formatDate(event.date);
                return (
                  <div key={event.id} className="event-card-glass large" onClick={() => setSelectedEvent(event)}>
                    <div className="card-image-container">
                      <img src={getImageUrl(event.image_url)} alt={event.title} />
                      <div className="date-badge-glass">
                        <span className="month">{month}</span>
                        <span className="day">{day}</span>
                      </div>
                    </div>
                    <div className="card-details">
                      <h3 className="card-event-title">{event.title}</h3>
                      <div className="card-meta">
                        <div className="meta-row">
                          <FaClock className="icon-red" /> 
                          <span>{event.time || "TBA"}</span>
                        </div>
                        <div className="meta-row">
                          <FaMapMarkerAlt className="icon-red" /> 
                          <span>{event.location || "TBA"}</span>
                        </div>
                      </div>
                      <button className="card-register-btn">View Details</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-events">No upcoming events at the moment.</p>
            )}
          </div>
        </section>

        {/* PAST SECTION */}
        <section className="events-section past-section">
          <h2 className="section-header">
            <FaHistory className="icon-red" /> Past Events
          </h2>
          <div className="events-grid">
            {pastEvents.map((event) => (
              <div 
                key={event.id} 
                className="event-card-glass past-card" 
                onClick={() => navigate(`/gallery`)}
              >
                <div className="card-image-container">
                  <img src={getImageUrl(event.image_url)} alt={event.title} />
                  <div className="past-overlay">View Gallery</div>
                </div>
                <div className="card-details">
                  <h3 className="card-event-title">{event.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}