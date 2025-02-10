const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    let token = req.header("Authorization")?.split(" ")[1];

    if (!token && req.cookies?.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) return res.status(401).json({ message: "Unauthorized user not found " });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


