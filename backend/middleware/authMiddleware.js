const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

const authMiddleware = (req, res, next) => {
    try {
        // Extract Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access Denied. No Token Provided" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("✅ Decoded Token:", decoded);

        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;
