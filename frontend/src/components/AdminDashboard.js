import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
    initCursor();
  }, []);

  // ================= FETCH =================
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "https://myporfolio-6ms5.onrender.com/api/contact",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully 👋");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  // ================= SEARCH =================
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= PAGINATION =================
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // ================= GROUP BY DATE =================
  const groupMessagesByDate = (msgs) => {
    const groups = {};

    msgs.forEach((msg) => {
      const dateObj = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = dateObj.toLocaleDateString();

      if (dateObj.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      }

      if (!groups[label]) {
        groups[label] = [];
      }

      groups[label].push(msg);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(currentMessages);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(
        `https://myporfolio-6ms5.onrender.com/api/contact/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      toast.success("Delete successfully ✅");

      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌");
    }
  };

  // ================= SESSION =================
  useEffect(() => {
    const expiry = localStorage.getItem("expiry");

    const interval = setInterval(() => {
      if (expiry && Date.now() > expiry) {
        localStorage.clear();
        toast.error("Session expired ⏳");
        setTimeout(() => {
          window.location.href = "/https://myporfolio-rouge.vercel.app/";
        }, 1500);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= CURSOR =================
  const initCursor = () => {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

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

  // ================= UI =================
  return (
    <div className="dashboard-bg">
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>🛡 Admin Dashboard</h2>

        <div className="menu-wrapper">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="menu-btn"
          >
            ⋮
          </button>

          {showMenu && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search messages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* MESSAGES */}
      <div className="messages-container">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              
              {/* DATE HEADER */}
              <h3 className="date-header">{date}</h3>

              {msgs.map((msg) => (
                <div key={msg._id} className="message-card">

                  {/* TOP ROW */}
                  <div className="message-top">
                    <span className="msg-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(msg._id)}
                    >
                      ❌
                    </button>
                  </div>

                  <p><strong>Name:</strong> {msg.name || "N/A"}</p>
                  <p><strong>Email:</strong> {msg.email}</p>
                  <p><strong>Subject:</strong> {msg.subject}</p>
                  <p><strong>Message:</strong> {msg.message}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="no-msg">No messages found 😔</p>
        )}
      </div>

      {/* PAGINATION */}
      {filteredMessages.length > 0 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ◀ Prev
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;