const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the temporary local file after upload
    fs.unlinkSync(localFilePath);

    console.log("Cloudinary Response:", response); 
    return response.secure_url; //  returning the URL
  } catch (error) {
    fs.unlinkSync(localFilePath); 
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
module.exports = { uploadOnCloudinary };