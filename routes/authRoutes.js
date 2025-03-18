const express = require("express");
const { register, login, logout, becomeSeller, refreshToken, getUserById,deleteUser, getAllUsers, getLoginHistory } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/Roalbase.auth.Middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUserById);
router.get("/users/:id/login-history", authMiddleware, roleMiddleware("admin"), getLoginHistory);
router.post("/logout", authMiddleware, logout);
router.post("/become-seller", authMiddleware, becomeSeller);
router.post("/refresh", refreshToken);

router.delete("/users/:id", authMiddleware, roleMiddleware("admin"),deleteUser);


module.exports = router;