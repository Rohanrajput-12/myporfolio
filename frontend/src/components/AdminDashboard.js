import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
    initCursor();
  }, []);

  // ✅ FETCH DATA
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

      setMessages(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ PAGINATION LOGIC
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  // ✅ CURSOR
  const initCursor = () => {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      }
    });

    const animate = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring) {
        ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      }
      requestAnimationFrame(animate);
    };
    animate();
  };

  return (
    <div className="dashboard-bg">

      {/* Cursor */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* Header */}
      <div className="dashboard-header">
        <h2>🛡 Admin Dashboard</h2>

        {/* 3 dots menu */}
        <div className="menu-wrapper">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-btn">
            ⋮
          </button>

          {showMenu && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {currentMessages.map((msg, index) => (
          <div key={index} className="message-card">

            <p><strong>Name:</strong> {msg.name || "N/A"}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Subject:</strong> {msg.subject}</p>
            <p><strong>Message:</strong> {msg.message}</p>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ Prev
        </button>

        <span>Page {currentPage} / {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ▶
        </button>
      </div>

    </div>
  );
}

export default AdminDashboard;