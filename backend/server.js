const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://myporfolio-rouge.vercel.app"
  ]
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* =========================
   SCHEMAS
========================= */

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Admin = mongoose.model("Admin", adminSchema);

/* =========================
   MIDDLEWARE
========================= */

// Simple auth middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== "admin-token") {
    return res.status(403).json({ message: "Unauthorized ❌" });
  }

  next();
};

/* =========================
   ROUTES
========================= */

// Save contact form
app.post("/api/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();
    res.json({ message: "Saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages (PROTECTED)
app.get("/api/contact", verifyAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(401).json({ message: "Admin not found ❌" });
  }

  if (admin.password !== password) {
    return res.status(401).json({ message: "Wrong password ❌" });
  }

  res.json({ token: "admin-token" });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});