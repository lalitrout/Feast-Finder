const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied. No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        console.log("Decoded Token:", decoded);  // ✅ Debugging log
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

module.exports = authMiddleware;
