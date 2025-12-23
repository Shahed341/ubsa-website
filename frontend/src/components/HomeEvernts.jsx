import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import "../style/HomeEvents.css";

export default function HomeEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter(e => e.date && new Date(e.date) >= today)
    .slice(0, 3);

  const img = (u) =>
    u ? `http://localhost:5000${u}` : "https://placehold.co/800x600";

  const openEvent = (id) => {
    navigate(`/events?open=${id}`);
  };

  return (
    <section className="home-events">
      <div className="home-events-section">
        <h2 className="home-events-title">
  <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
  <span>Upcoming </span>
  <span className="ubsa">UBSA</span>
  <span> Events</span>
</h2>


        <div
          className={`home-events-grid ${
            upcoming.length < 3 ? "centered" : ""
          }`}
        >
          {upcoming.length === 0 && (
            <p className="no-events">No upcoming events</p>
          )}

          {upcoming.map(e => (
            <div
              key={e.id}
              className="home-event-card"
            >
              <div
                className="home-event-image"
                onClick={() => openEvent(e.id)}
              >
                <img src={img(e.image_url)} alt={e.title} />
              </div>

              <div className="home-event-content">
                <h3>{e.title}</h3>

                <div className="home-event-meta">
                  <span>
                    <FaClock /> {e.time || "All Day"}
                  </span>
                  <span>
                    <FaMapMarkerAlt /> {e.location || "TBA"}
                  </span>
                </div>

                <button
                  className="home-register-btn"
                  onClick={() => openEvent(e.id)}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="home-events-cta">
          <button onClick={() => navigate("/events")}>
            Explore All Events
          </button>
        </div>
      </div>
    </section>
  );
}
