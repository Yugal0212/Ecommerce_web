const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  images: [String],  // Cloudinary image URLs
  stockQuantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
