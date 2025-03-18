const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { user: req.user._id, items: [], total: 0 });
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
  
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity." });
    }
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [], total: 0 });
      }
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * product.price;
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          totalPrice: product.price * quantity,
          images: product.images // Include the images array
        });
      }
  
      cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error('Error in addToCart:', error);
      res.status(500).json({ message: "Internal server error. Please try again." });
    }
  };

exports.updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.json({ message: "Product not in cart" });

    item.quantity = quantity;
    item.totalPrice = item.price * quantity;
    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();
    res.json(cart);
};

exports.removeItem = async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();
    res.json(cart);
};

exports.clearCart = async (req, res) => {
  try {
      await Cart.findOneAndDelete({ user: req.user._id });
      res.json({ message: "Cart cleared successfully." });
  } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: "Internal server error. Please try again." });
  }
};
