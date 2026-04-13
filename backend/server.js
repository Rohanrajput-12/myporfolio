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
// app.post("/api/contact", async (req, res) => {
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


const app = express();

// Middleware
app.use(cors());
app.use(express.json());



require("dotenv").config();

// ✅ MongoDB Atlas connection
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

// API route
app.post("/api/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();
    res.status(200).json({ message: "Saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});