import { useEffect, useState } from "react";
import axios from "axios";

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

    setMessages(res.data);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {messages.map((msg, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h4>{msg.name}</h4>
          <p>{msg.email}</p>
          <p>{msg.subject}</p>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;