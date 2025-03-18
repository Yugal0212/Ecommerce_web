const express = require("express");
const { addAddress, getAllAddresses, updateAddress, deleteAddress, getAddressById } = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addAddress); 
router.get("/", authMiddleware, getAllAddresses);
router.get("/:id", authMiddleware, getAddressById); 
router.put("/:id", authMiddleware, updateAddress); // Update Address
router.delete("/:id", authMiddleware, deleteAddress); // Delete Address

module.exports = router;
