const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place Order
exports.placeOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddress } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.json({ message: "Cart is empty." });
        }

        const order = new Order({
            user: req.user._id,
            items: cart.items,
            shippingAddress,
            totalAmount: cart.total,
            paymentMethod,
            orderStatus: "Processing"
        });

        await order.save();
        await Cart.findOneAndDelete({ user: req.user._id });

        res.json({ message: "Order placed successfully", order });
    } catch (error) {
        res.json({ error: error.message });
    }
};

// Get User Orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.json({ error: error.message });
    }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("items.product");

        if (!order) {
            return res.json({ message: "Order not found" });
        }

        res.json({ order });
    } catch (error) {
        res.json({ error: error.message });
    }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.json({ message: "Order not found" });
        }

        if (order.orderStatus !== "Processing") {
            return res.json({ message: "Order cannot be cancelled" });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.json({ error: error.message });
    }
};

// Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.json({ error: error.message });
    }
};

// Admin: Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.json({ message: "Order not found" });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.json({ error: error.message });
    }
};
