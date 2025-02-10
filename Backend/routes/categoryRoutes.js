const express = require("express");
const { upload } = require("../middleware/Multer.middleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/Roalbase.auth.Middleware");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  getProductsByCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategory);

router.post("/", authMiddleware, roleMiddleware("seller", "admin"), upload.single("image"), createCategory);
router.put("/:id", authMiddleware, roleMiddleware("seller", "admin"), upload.single("image"), updateCategory);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCategory);

module.exports = router;
