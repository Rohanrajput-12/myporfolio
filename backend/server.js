// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/contactDB")
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch(err => console.log(err));

// // Schema
// const contactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   subject: String,
//   message: String,
//   createdAt: { type: Date, default: Date.now }
// });

// const Contact = mongoose.model("Contact", contactSchema);

// // API route
// app.post("https://myporfolio-rouge.vercel.app/api/contact", async (req, res) => {
//   try {
//     const data = new Contact(req.body);
//     await data.save();
//     res.status(200).json({ message: "Saved successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "https://myporfolio-rouge.vercel.app",
    "http://localhost:3000"
  ]
}));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch(err => console.log(err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Correct API route
app.post("/api/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();
    res.status(200).json({ message: "Saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.get("/api/contact", verifyAdmin, async (req, res) => {
  const messages = await Contact.find();
  res.json(messages);
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "123456") {
    res.json({ token: "admin-token" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});
