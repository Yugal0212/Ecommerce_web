// authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    let token = req.header("Authorization")?.split(" ")[1]; // Get the token from the Authorization header

    if (!token && req.cookies?.refreshToken) {
      token = req.cookies.refreshToken; // Fallback to refreshToken in cookies
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.REFRESH_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};