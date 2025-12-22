import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaReply, FaTrash, FaEnvelopeOpenText, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import '../../style/adminpages/Dashboard.css';
import '../../style/adminpages/Inbox.css';

export default function Inbox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [replyModal, setReplyModal] = useState({ open: false, msg: null, text: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('http://localhost:5000/api/contact-messages');
    const data = await res.json();
    setMessages(data);
  };

  const handleReply = async () => {
    if (!replyModal.text) return alert("Please type a reply.");
    
    try {
      const res = await fetch('http://localhost:5000/api/contact-messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: replyModal.msg.email,
          subject: `Re: ${replyModal.msg.subject}`,
          replyText: replyModal.text,
          messageId: replyModal.msg.id
        })
      });

      if (res.ok) {
        alert("Reply sent successfully!");
        setReplyModal({ open: false, msg: null, text: '' });
        fetchMessages();
      }
    } catch (err) {
      alert("Error sending reply.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-text">
          <h1><FaEnvelopeOpenText className="header-icon-main" /> Member <span className="text-highlight">Inbox</span></h1>
          <p>Read and respond to inquiries from the website contact form.</p>
        </div>
        <button className="logout-pill" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={() => navigate('/admin/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <div className="glass inbox-wrapper">
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-card ${msg.status}`}>
              <div className="msg-info">
                <span className={`status-dot ${msg.status}`}></span>
                <h4>{msg.subject || "No Subject"}</h4>
                <p>From: <strong>{msg.name}</strong> ({msg.email})</p>
                <div className="msg-body">{msg.message}</div>
              </div>
              <div className="msg-actions">
                {msg.status === 'unread' && (
                  <button className="reply-btn" onClick={() => setReplyModal({ open: true, msg, text: '' })}>
                    <FaReply /> Reply
                  </button>
                )}
                <button className="delete-btn-icon"><FaTrash /></button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="empty-msg">No messages found.</p>}
        </div>
      </div>

      {/* REPLY MODAL */}
      {replyModal.open && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h3>Reply to {replyModal.msg.name}</h3>
            <textarea 
              placeholder="Type your response here..."
              value={replyModal.text}
              onChange={(e) => setReplyModal({...replyModal, text: e.target.value})}
            />
            <div className="modal-btns">
              <button onClick={() => setReplyModal({ open: false, msg: null, text: '' })}>Cancel</button>
              <button className="send-btn" onClick={handleReply}><FaPaperPlane /> Send Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}