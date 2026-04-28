const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* =========================
   ✅ MIDDLEWARE
========================= */
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://myporfolio-rouge.vercel.app"
  ],
  credentials: true
}));

/* =========================
   ✅ DB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error ❌", err));

/* =========================
   📩 CONTACT SCHEMA
========================= */
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

/* =========================
   👤 USER SCHEMA
========================= */
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model("User", userSchema);

/* =========================
   🔐 CREATE ADMIN (RUN ONCE)
========================= */
const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "admin@gmail.com" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashed,
        role: "admin"
      });

      console.log("Admin created ✅");
    } else {
      console.log("Admin already exists");
    }

  } catch (err) {
    console.log("Admin error", err);
  }
};

createAdmin(); // ⚠️ run once, then comment it

/* =========================
   📝 CONTACT API (PUBLIC)
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();
    res.json({ message: "Message saved ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🧾 SIGNUP
========================= */
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "user"
    });

    res.json({ message: "Signup successful ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🔑 LOGIN
========================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3. Check password exists
    if (!user.password) {
      return res.status(500).json({ message: "User password missing" });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 5. Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Send response
    res.status(200).json({
      message: "Login successful ✅",
      token,
      role: user.role
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err); // 🔴 important
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* =========================
   🛡️ ADMIN MIDDLEWARE
========================= */
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   📊 GET CONTACTS (ADMIN)
========================= */
app.get("/api/contacts", verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🚀 SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});