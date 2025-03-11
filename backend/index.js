const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

const EventInfo = require("./models/EventInfo");
const User = require("./models/User"); // Import User model
const authMiddleware = require("./middleware/authMiddleware"); // Import authentication middleware

const app = express();
const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`);
        });
    })
    .catch((err) => console.error("DB Connection Error:", err));

// ✅ **User Registration (Signup)**
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();

        // ✅ Auto-login after signup (Generate JWT token)
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ success: true, message: "User registered successfully!", token, userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error });
    }
});

// ✅ **User Login**
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ error: "User not found" });
        }

        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Invalid credentials");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        console.log("✅ Login successful!");
        res.json({ message: "Login successful", token, userId: user._id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed", details: error });
    }
});


// ✅ **Fetch All Users (Protected)**
app.get("/api/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// ✅ **Insert Event (Protected Route)**
app.post("/api/events", authMiddleware, async (req, res) => {
    try {
        const { name, location, date, img } = req.body;

        const newEvent = new EventInfo({
            name,
            location,
            date: new Date(date).toISOString(),
            img,
            createdBy: req.user.userId, // Use authenticated user's ID
        });

        await newEvent.save();
        res.status(201).json({ message: "Event added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add event", details: error });
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

// ✅ Delete Event (Protected Route)
app.delete("/api/events/:id", authMiddleware, async (req, res) => {
    try {
        const event = await EventInfo.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        console.log("Event found:", event);
        console.log("Event creator ID:", event.createdBy.toString());
        console.log("Logged-in user ID:", req.user.userId);

        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this event" });
        }

        await EventInfo.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event", details: error });
    }
});


