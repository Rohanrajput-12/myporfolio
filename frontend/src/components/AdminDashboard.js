import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://myporfolio-6ms5.onrender.com/api/contacts",
          {
            headers: {
              Authorization: token
            }
          }
        );

        setContacts(res.data);

      } catch (err) {
        alert("Unauthorized ❌");
        navigate("/login");
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {contacts.map((c) => (
        <div key={c._id} style={{ marginBottom: "20px" }}>
          <h4>{c.name}</h4>
          <p>{c.email}</p>
          <p>{c.subject}</p>
          <p>{c.message}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;