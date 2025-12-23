import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaHistory,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt
} from "react-icons/fa";
import "../style/Events.css";

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  const getImageUrl = (url) =>
    url ? (url.startsWith("http") ? url : `http://localhost:5000${url}`) : "https://placehold.co/600x400";

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      day: d.getDate(),
      full: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  /* ---------- MODAL ---------- */
  const EventModal = ({ event }) => (
    <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
      <div className="event-modal-glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>&times;</button>

        <div className="modal-content-wrapper">
          <div className="modal-details">
            <h2 className="modal-title">{event.title}</h2>

            <div className="modal-meta-row">
              <span className="meta-tag">
                <FaCalendarAlt /> {formatDate(event.date).full}
              </span>
              {event.time && (
                <span className="meta-tag">
                  <FaClock /> {event.time}
                </span>
              )}
            </div>

            {event.location && (
              <p className="modal-location">
                <FaMapMarkerAlt /> {event.location}
              </p>
            )}

            <div className="modal-description-scroll">
              {event.description}
            </div>

            <Link to={`/events/${event.id}`} className="register-btn red">
              <FaTicketAlt /> Register Now
            </Link>
          </div>

          <div className="modal-image-col">
            <img src={getImageUrl(event.image_url)} alt={event.title} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="events-page">
      <h1 className="page-title">
        Our <span className="text-highlight">Gatherings</span>
      </h1>

      {/* UPCOMING */}
      <section className="events-section">
        <h2 className="section-title">
          <FaCalendarAlt /> Upcoming Events
        </h2>

        <div className="events-grid">
          {upcomingEvents.map(event => {
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
                    <span><FaClock /> {event.time || "All Day"}</span>
                    <span><FaMapMarkerAlt /> {event.location || "TBA"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PAST */}
      <section className="events-section">
        <h2 className="section-title">
          <FaHistory /> Past Events
        </h2>

        <div className="events-grid">
          {pastEvents.map(event => {
            const { month, day } = formatDate(event.date);
            return (
              <div
                key={event.id}
                className="event-card past"
                onClick={() => navigate(`/gallery/${event.id}`)}
              >
                <div className="card-image">
                  <img src={getImageUrl(event.image_url)} alt={event.title} />
                  <div className="date-badge">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                  </div>
                </div>

                <div className="card-content">
                  <h3>{event.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedEvent && <EventModal event={selectedEvent} />}
    </div>
  );
}
