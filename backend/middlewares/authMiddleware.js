// Import jsonwebtoken to verify JWT tokens
const jwt = require("jsonwebtoken");

// Middleware function that runs BEFORE protected routes
module.exports = (req, res, next) => {

  // Read token sent by frontend in the Authorization header
  // Example: Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const token = req.header("Authorization");

  // If token is missing → User is not authenticated
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token using JWT_SECRET (kept in .env)
    // If token is valid → returns decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (user id) to req object
    // Now the next route can know which user is making the request
    req.user = decoded;

    // Allow request to move to the protected route
    next();
  } catch (err) {
    // Token invalid / expired / tampered
    return res.status(401).json({ message: "Invalid token" });
  }
};
