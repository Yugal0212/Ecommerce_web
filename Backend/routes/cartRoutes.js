const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, cartController.getCart);
router.post("/add", authMiddleware, cartController.addToCart);
router.put("/update", authMiddleware, cartController.updateQuantity);
router.delete("/remove/:productId", authMiddleware, cartController.removeItem);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
