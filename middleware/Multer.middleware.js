const multer = require("multer");
const path = require("path");

// Set storage location
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store in a folder inside your project (e.g., 'uploads')
    cb(null, path.join(__dirname, "../utils/Uploads"));
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
