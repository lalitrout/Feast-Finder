const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";
const EventInfo = require("./models/EventInfo");
const User = require("./models/User"); 
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URL;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedOrigins = [
    "http://localhost:5173", // Local frontend
    "https://feast-finder-rho.vercel.app" // Deployed frontend
];

// Middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(bodyParser.json());

// Multer configuration (memory storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(url)
    .then(() => {
        console.log("✅ Connected to DB");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error("❌ DB Connection Error:", err));

// User Registration
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

// User Login
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

// Fetch All Users (Protected Route)
app.get("/api/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Insert Event with Cloudinary Upload
app.post("/api/events", authMiddleware, upload.single("img"), async (req, res) => {
    try {
        const { name, location, date, contactInfo } = req.body;

        if (!req.file) return res.status(400).json({ error: "Image file is required" });

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream(
            { folder: "event_images" },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });

                const newEvent = new EventInfo({
                    name,
                    location,
                    date: new Date(date).toISOString(),
                    img: result.secure_url, // Cloudinary image URL
                    contactInfo,
                    createdBy: req.user.userId,
                });
                console.log(newEvent);

                await newEvent.save();
                res.status(201).json({ message: "Event added successfully!", event: newEvent });
            }
        ).end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: "Failed to add event", details: error.message });
    }
});

// Fetch All Events
app.get("/api/events", async (req, res) => {
    try {
        const events = await EventInfo.find().populate("createdBy", "name email");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Delete Event (Protected Route)
app.delete("/api/events/:id", authMiddleware, async (req, res) => {
    try {
        const event = await EventInfo.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.createdBy.toString() !== req.user.userId)
            return res.status(403).json({ error: "Unauthorized to delete this event" });

        await EventInfo.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event", details: error.message });
    }
});
