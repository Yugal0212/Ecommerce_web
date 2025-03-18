const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus ,getOrdersByUserId} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/Roalbase.auth.Middleware"); // Import role-based middleware


// 📌 User Routes
router.post("/place", authMiddleware, placeOrder); // Place an order
router.get("/my-orders", authMiddleware, getMyOrders); // Get user's orders
router.get("/:orderId", authMiddleware, getOrderById); // Get order details
router.put("/cancel/:orderId", authMiddleware, cancelOrder); // Cancel an order

// 📌 Admin Routes
router.get("/all", authMiddleware, authorize("admin"), getAllOrders);  // Admin: Gall orders
router.put("/status/:orderId", authMiddleware,authorize("admin"), updateOrderStatus); // Admin: Update order status
router.get("/user/:userId", authMiddleware,authorize("admin"), getOrdersByUserId); // Add this route

module.exports = router;
