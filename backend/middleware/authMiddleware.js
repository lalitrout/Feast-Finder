const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey";

// Middleware for checking the access token and refreshing it using the refresh token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied. No Token Provided" });
    }

    try {
        // Attempt to decode and verify the access token first
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        console.log("Decoded Token:", decoded);  // ✅ Debugging log

        // Attach the user data to the request object
        req.user = decoded;

        // If the access token is valid, continue with the request
        next();

    } catch (error) {
        // If the access token is expired or invalid, try refreshing it using the refresh token
        if (error.name === "TokenExpiredError") {
            // Retrieve the refresh token from the client (usually sent as a cookie or in the body)
            const refreshToken = req.header("Refresh-Token");

            if (!refreshToken) {
                return res.status(401).json({ error: "Refresh Token Required" });
            }

            try {
                // Verify the refresh token
                const decodedRefreshToken = jwt.verify(refreshToken, SECRET_KEY);
                console.log("Decoded Refresh Token:", decodedRefreshToken);  // ✅ Debugging log

                // Generate a new access token using the data from the refresh token
                const newAccessToken = jwt.sign(
                    { userId: decodedRefreshToken.userId, email: decodedRefreshToken.email },
                    SECRET_KEY,
                    { expiresIn: "1h" } // Set the new access token's expiration time (e.g., 1 hour)
                );

                // Send the new access token back in the response header (optional)
                res.setHeader("x-new-token", newAccessToken);

                // Attach the new token to the request object (optional, if needed for further processing)
                req.user = decodedRefreshToken;

                // Proceed with the request, as the access token has been refreshed
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
