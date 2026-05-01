import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ NEW: search state
  const [search, setSearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
    initCursor();
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

      setMessages(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ FILTER LOGIC
  const filteredMessages = messages.filter((msg) =>
    msg.name?.toLowerCase().includes(search.toLowerCase()) ||
    msg.email?.toLowerCase().includes(search.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(search.toLowerCase()) ||
    msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination on filtered data
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // cursor
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

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this message?");
  if (!confirmDelete) return;

  try {
    await axios.delete(
      `https://myporfolio-6ms5.onrender.com/api/contact/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    // ✅ Toast message
    toast.success("Deleted successfully ✅");

    // remove from UI
    setMessages(messages.filter((msg) => msg._id !== id));

  } catch (err) {
    console.error(err);
    toast.error("Delete failed ❌");
  }
};

  return (
    <div className="dashboard-bg">

      {/* Cursor */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* Header */}
      <div className="dashboard-header">
        <h2>🛡 Admin Dashboard</h2>

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

      {/* ✅ SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search by name, email, subject..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />
      </div>

      {/* Messages */}
      <div className="messages-container">
        {currentMessages.length > 0 ? (
          currentMessages.map((msg, index) => (
            <div key={index} className="message-card">
               <button
                className="delete-btn"
                onClick={() => handleDelete(msg._id)}
              >
                ❌
              </button>
              <p><strong>Name:</strong> {msg.name || "N/A"}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Subject:</strong> {msg.subject}</p>
              <p><strong>Message:</strong> {msg.message}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No messages found 😔
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredMessages.length > 0 && (
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
      )}

    </div>
  );
}

export default AdminDashboard;