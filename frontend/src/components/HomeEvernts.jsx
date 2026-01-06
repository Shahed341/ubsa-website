import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaTicketAlt, FaCalendarAlt } from "react-icons/fa";
import "../style/HomeEvents.css";

// Asset Imports
import TigerBG from "../assets/Event_page.jpg"; 
import EventIcon from "../assets/BD_Cultural_Elements/Event_icon.png";

/**
 * SUB-COMPONENT: HomeEventTitle
 * Renders the high-impact glassmorphism title with the custom icon.
 */
const HomeEventTitle = () => (
  <div className="home-events-title-container">
    <h2 className="home-events-title title-glass-card">
      <img 
        src={EventIcon} 
        alt="Event Icon" 
        className="title-custom-icon" 
      />
      <span className="latest">Upcoming </span>
      <span className="ubsa">UBSA</span>
      <span className="event-txt"> Events</span>
    </h2>
  </div>
);

/**
 * MAIN COMPONENT: HomeEvents
 * Features the dynamic "Tiger" background, Neon Snake animated border, 
 * and the latest upcoming event data.
 */
export default function HomeEvents() {
  const [latestEvent, setLatestEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter for future events and sort by date (closest first)
        const sortedUpcoming = data
          .filter((e) => e.date && new Date(e.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setLatestEvent(sortedUpcoming[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const img = (u) =>
    u ? `http://localhost:5000${u}` : "https://placehold.co/800x600";

  const formatDateParts = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString("default", { month: "short" }),
    };
  };

  if (loading) return null;

  return (
    <section className="home-events">
      {/* --- IMMERSIVE BLURRED TIGER BACKGROUND --- */}
      <div 
        className="home-events-page-bg" 
        style={{ '--events-bg': `url(${TigerBG})` }}
      />

      <div className="home-events-content-wrapper">
        {/* Render the Sub-Component Defined Above */}
        <HomeEventTitle /> 

        {latestEvent ? (
          /* NEON SNAKE GLOW BORDER WRAPPER */
          <div className="home-event-glow-wrapper">
            {/* These divs are animated via CSS offset-path */}
            <div className="snake-light red-snake"></div>
            <div className="snake-light green-snake"></div>
            
            <div className="home-event-card wide-featured depth-shadow">
              <div 
                className="home-event-image" 
                onClick={() => navigate(`/events?open=${latestEvent.id}`)}
              >
                <img src={img(latestEvent.image_url)} alt={latestEvent.title} />
                
                <div className="featured-date-badge">
                  <span className="badge-month">{formatDateParts(latestEvent.date).month}</span>
                  <span className="badge-day">{formatDateParts(latestEvent.date).day}</span>
                </div>
              </div>

              <div className="home-event-card-body">
                <h2>{latestEvent.title}</h2>
                
                <div className="home-event-meta">
                  <div className="meta-item">
                    <FaCalendarAlt className="icon-date-only" /> 
                    <span className="meta-text">
                      {new Date(latestEvent.date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="icon-time-only" /> 
                    <span className="meta-text">{latestEvent.time || "TBA"}</span>
                  </div>
                  <div className="meta-item">
                    <FaMapMarkerAlt className="icon-loc-only" /> 
                    <span className="meta-text">{latestEvent.location || "TBA"}</span>
                  </div>
                </div>

                <p className="event-description">
                  {latestEvent.description || 
                    "Join us for our next big gathering! Immerse yourself in the culture and community of UBSA."}
                </p>

                <div className="home-event-actions">
                  <button 
                    className="home-register-btn depth-btn"
                    onClick={() => navigate(`/events?open=${latestEvent.id}`)}
                  >
                    Register Now
                  </button>
                  <div className="ticket-price">
                    <FaTicketAlt style={{ marginRight: "0.5rem" }} />
                    {latestEvent.price ? `$${latestEvent.price}` : "FREE"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FALLBACK STATE IF NO EVENTS ARE FOUND */
          <div className="no-events-box glass-screen">
            <p>No upcoming events scheduled. Check back soon!</p>
          </div>
        )}

        <div className="home-events-cta">
          <button className="depth-btn" onClick={() => navigate("/events")}>
            Explore More Events
          </button>
        </div>
      </div>
    </section>
  );
}