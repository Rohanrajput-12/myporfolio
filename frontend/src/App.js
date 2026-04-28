import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";
import YourPortfolio from "./components/YourPortfolio"; 

function App() {
  return (
    <Routes>

      <Route path="/" element={<YourPortfolio />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<AdminDashboard />} />

    </Routes>
  );
}

export default App;