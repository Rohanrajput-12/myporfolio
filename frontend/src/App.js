import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./components/AdminDashboard";
import YourPortfolio from "./components/YourPortfolio"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* ✅ Correct place */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#050a10",
            color: "#00f0ff",
            border: "1px solid rgba(0,240,255,0.2)"
          }
        }}
      />

      <Routes>
        <Route path="/" element={<YourPortfolio />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;