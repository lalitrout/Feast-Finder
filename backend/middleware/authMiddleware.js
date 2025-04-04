const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

const authMiddleware = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access Denied. No Token Provided" });
    }

    token = token.replace("Bearer ", ""); // Ensure correct token format

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            const refreshToken = req.header("Refresh-Token");
            if (!refreshToken) {
                return res.status(401).json({ error: "Refresh Token Required" });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, SECRET_KEY);
                const newAccessToken = jwt.sign(
                    { userId: decodedRefresh.userId, email: decodedRefresh.email },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                res.setHeader("x-new-token", newAccessToken);
                req.user = decodedRefresh;
                next();
            } catch (refreshError) {
                return res.status(401).json({ error: "Invalid or Expired Refresh Token" });
            }
        } else {
            return res.status(401).json({ error: "Invalid Token" });
        }
    }
};

module.exports = authMiddleware;
