import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "https://myporfolio-6ms5.onrender.com/api/contact",
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      // 🔥 latest → old
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMessages(sorted);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");

  let mx = 0, my = 0, rx = 0, ry = 0;

  const move = (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (cursor) {
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    }
  };

  document.addEventListener("mousemove", move);

  function animate() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    if (ring) {
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    }

    requestAnimationFrame(animate);
  }

  animate();

  return () => {
    document.removeEventListener("mousemove", move);
  };
}, []);

  return (
    <div className="dashboard-bg">
    <div className="cursor" id="cursor"></div>
    <div className="cursor-ring" id="cursorRing"></div>

      <h1 className="dashboard-title">🛡 Admin Dashboard</h1>

      <div className="messages-list">

        {messages.length === 0 ? (
          <p className="no-data">No messages found</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message-row">

              <div className="row-header">
                <span className="name">{msg.name || "Anonymous"}</span>
                <span className="date">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="row-item">
                <span className="label">Email:</span>
                <span className="value">{msg.email}</span>
              </div>

              <div className="row-item">
                <span className="label">Subject:</span>
                <span className="value">
                  {msg.subject || "No Subject"}
                </span>
              </div>

              <div className="row-item">
                <span className="label">Message:</span>
                <span className="value message-text">{msg.message}</span>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;