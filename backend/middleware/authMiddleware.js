const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No Token Provided" });
  }

  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
