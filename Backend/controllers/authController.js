const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,  
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,  
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};


exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //all fildes are quired //
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

   
    user.refreshToken = refreshToken;
    await user.save();

    
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.json({ accessToken, role: user.role, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed!" });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.perms.id);
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Logout failed!" });
  }
};


exports.becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.role === "seller") {
      return res.status(400).json({ message: "You are already a seller!" });
    }

    const { storeName, storeDescription, contactNumber, storeAddress } = req.body;

  
    if (!storeName) {
      return res.status(400).json({ message: "Store name is required!" });
    }

    
    user.sellerDetails = {
      storeName,
      storeDescription,
      contactNumber,
      storeAddress,
    };

    // Change role to seller
    user.role = "seller";
    await user.save();

    res.json({
      message: "You are now a seller!",
      sellerDetails: user.sellerDetails,
    });
  } catch (error) {
    res.status(500).json({ message:"Failed to become a seller!" });
  }
};



exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).json({ message: "No refresh token" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(400).json({ message: "Invalid refresh token" });

    const newTokens = generateTokens(user);
    user.refreshToken = newTokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true });
    res.json({ accessToken: newTokens.accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message || "Token refresh failed!" });
  }
};
