const Product = require("../models/Product");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, category } = req.body;
    if (!name || !description || !price || !stockQuantity || !category) {
      return res.json({ message: "All fields are required" });
    }

    const uploadedImages = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) uploadedImages.push(result);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      category,
      seller: req.user._id,
      images: uploadedImages,
    });

    res.json({ message: "Product created", product });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name").populate("seller", "name");
    res.json(products);
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name").populate("seller", "name");
    res.json(product || { message: "Product not found" });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.json({ message: "Unauthorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Product updated", product: updatedProduct });
  } 
  catch (error) {
    res.json({ message: "Server error" });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ message: "Product not found" });

    if (req.user.role !== "admin") 
      return res.json({ message: "Unauthorized to delete this product" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
