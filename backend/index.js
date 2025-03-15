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
    folder: "wanderlust_DEV",
    allowed_formats: ["jpg", "png", "jpeg"],
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

// ✅ **User Registration**
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: "1h" });
    res.status(201).json({ success: true, message: "User registered successfully!", token, userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
});

// ✅ **User Login**
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// ✅ **Fetch All Users (Protected)**
app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ **Insert Event (Now Supports Image Upload)**
app.post("/api/events", authMiddleware, upload.single("img"), async (req, res) => {
  try {
    const { name, location, date } = req.body;
    const imageUrl = req.file ? req.file.path : ""; // Get Cloudinary URL

    const newEvent = new EventInfo({
      name,
      location,
      date: new Date(date).toISOString(),
      img: imageUrl,
      createdBy: req.user.userId,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event", details: error.message });
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

// ✅ **Delete Event (Protected)**
app.delete("/api/events/:id", authMiddleware, async (req, res) => {
  try {
    const event = await EventInfo.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ error: "Unauthorized to delete this event" });

    // Delete Image from Cloudinary
    const imagePublicId = event.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`event_images/${imagePublicId}`);

    await EventInfo.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event", details: error.message });
  }
});
