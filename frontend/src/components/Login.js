import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await axios.post(
        "https://myporfolio-6ms5.onrender.com/api/admin/login",
        { email, password }
      );

      // save token
      localStorage.setItem("token", res.data.token);

      alert("Login successful ✅");

      // redirect to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;