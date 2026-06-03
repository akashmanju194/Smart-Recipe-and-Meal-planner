const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
