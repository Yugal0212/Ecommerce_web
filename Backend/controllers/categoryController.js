const Category = require("../models/Category");
const Product = require("../models/Product");
const { uploadOnCloudinary } = require("../utils/cloudinary");

exports.createCategory = async (req, res) => {
  if (!req.file) return res.json({ message: "Image required" });

  const existingCategory = await Category.findOne({ name: req.body.name });
  if (existingCategory) 
    return res.json({ message: "Category already exists" });

  const image = await uploadOnCloudinary(req.file.path);
  const category = await Category.create({ ...req.body, image });

  res.json(category);
};


exports.getAllCategories = async (req, res) => {
  const category = await Category.find();
  res.json(category);
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ ...category.toObject(), id: category._id }); // Map _id to id
};

exports.getProductsByCategory = async (req, res) => {
const category = await Product.find({ category: req.params.id })
  res.json(category);
};

exports.updateCategory = async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (!category) return res.json({ message: "Not found" });

  if (req.file) category.image = await uploadOnCloudinary(req.file.path);
  Object.assign(category, req.body);
  await category.save();

  res.json(category);
};


exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 