const express = require("express");
const { upload } = require("../middleware/Multer.middleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/Roalbase.auth.Middleware"); // Import role-based middleware
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByseller,
  serchbyproducts
} = require("../controllers/productController");

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("seller", "admin"), upload.array("images", 5), createProduct);
router.get("/", getAllProducts);
router.get("/seller",authMiddleware,roleMiddleware("seller", "admin"),getProductsByseller)
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, roleMiddleware("seller", "admin"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("seller","admin"), deleteProduct);
router.get("/search",authMiddleware, serchbyproducts); 

module.exports = router;
