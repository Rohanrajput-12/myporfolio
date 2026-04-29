import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminLogin.css";


function AdminLogin() {

  useEffect(() => {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");

  let mx = 0, my = 0, rx = 0, ry = 0;

  const moveCursor = (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (cursor) {
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    }
  };

  document.addEventListener("mousemove", moveCursor);

  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;

    if (ring) {
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    }

    requestAnimationFrame(animateRing);
  }

  animateRing();

  // hover effect
  document.querySelectorAll("button, input").forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (ring) {
        ring.style.width = "55px";
        ring.style.height = "55px";
      }
    });

    el.addEventListener("mouseleave", () => {
      if (ring) {
        ring.style.width = "36px";
        ring.style.height = "36px";
      }
    });
  });

  return () => {
    document.removeEventListener("mousemove", moveCursor);
  };
}, []);


  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("⚠ Enter email & password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://myporfolio-6ms5.onrender.com/api/admin/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      setTimeout(() => {
        setLoading(false);
        window.location.href = "/dashboard";
      }, 1200);

    } catch (err) {
      setLoading(false);
      setError("⚠ Invalid credentials");
    }
  };
  

  return (

    
    
    <div className="admin-bg">
      
      <div className="cursor" id="cursor"></div>
       <div className="cursor-ring" id="cursorRing"></div>

      {/* Floating particles */}
      <div className="particles"></div>

      <div className="admin-card">

        <div className="admin-header">
          <div className="shield">🛡️</div>
          <h2 className="title">
            Admin <span>Access</span>
          </h2>
          
        </div>

        <div className="warning">
          ⚠ Unauthorized access attempts are logged
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className={`login-btn ${loading ? "loading" : ""}`}
          onClick={handleLogin}
        >
          {loading ? <div className="spinner"></div> : "🛡 Secure Login →"}
        </button>

        <p className="note">
          Admin accounts cannot be self-registered
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;