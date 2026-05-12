const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://myporfolio-rouge.vercel.app",
    ],
  }),
);

// ================= MONGODB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ================= SCHEMA =================
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,

  // IMPORTANT
  read: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// ================= ADMIN =================
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// ================= AUTH =================
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== "admin-token") {
    return res.status(403).json({
      message: "Unauthorized ❌",
    });
  }

  next();
};

// ================= SAVE CONTACT =================
app.post("/api/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);

    await data.save();

    res.json({
      message: "Message sent ✅",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET ALL MESSAGES =================
app.get("/api/contact", verifyAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching messages",
    });
  }
});

// ================= UNREAD COUNT =================
app.get("/api/unread-count", async (req, res) => {
  try {
    const count = await Contact.countDocuments({
      read: false,
    });

    res.json({
      count,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching unread count",
    });
  }
});

// ================= MARK MESSAGE AS READ =================
app.put("/api/contact/read/:id", async (req, res) => {
  try {
    const updatedMessage = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      {
        new: true,
      },
    );

    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({
      message: "Error updating message",
    });
  }
});

// ================= DELETE MESSAGE =================
app.delete("/api/contact/:id", verifyAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully ✅",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete failed ❌",
    });
  }
});

// ================= ADMIN LOGIN =================
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found ❌",
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        message: "Wrong password ❌",
      });
    }

    res.json({
      token: "admin-token",
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});