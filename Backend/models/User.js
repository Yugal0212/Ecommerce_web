const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }], // Reference addresses
    refreshToken: { type: String, default: null },
    sellerDetails: {
      storeName: { type: String, required: false },
      storeDescription: { type: String, required: false },
      contactNumber: { type: String, required: false },
      storeAddress: { type: String, required: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
