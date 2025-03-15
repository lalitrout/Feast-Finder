const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";
const EventInfo = require("./models/EventInfo");
const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URL;

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "feastfinder_events", // Updated folder name
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ✅ Middleware
const corsOptions = {
  origin: "https://frontend-sigma-five-47.vercel.app",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose
  .connect(url)
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ **Insert Event (Supports Image Upload)**
app.post("/api/events", authMiddleware, upload.single("img"), async (req, res) => {
  try {
    const { name, location, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const newEvent = new EventInfo({
      name,
      location,
      date: new Date(date).toISOString(),
      img: {
        url: req.file.path, // Cloudinary Image URL
        public_id: req.file.filename, // Store Cloudinary Public ID
      },
      createdBy: req.user.userId,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully!", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event", details: error.message });
  }
});

// ✅ **Delete Event (Also Deletes Cloudinary Image)**
app.delete("/api/events/:id", authMiddleware, async (req, res) => {
  try {
    const event = await EventInfo.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ error: "Unauthorized to delete this event" });

    // ✅ Delete Image from Cloudinary
    if (event.img && event.img.public_id) {
      await cloudinary.uploader.destroy(event.img.public_id);
    }

    await EventInfo.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event", details: error.message });
  }
});

// ✅ **Fetch All Events**
app.get("/api/events", async (req, res) => {
  try {
    const events = await EventInfo.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});
