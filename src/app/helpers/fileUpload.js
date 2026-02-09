import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../config/env.js';

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Cloudinary upload (handles images and videos)
const uploadToCloudinary = async (file) => {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: envVars.cloudinary.cloud_name,
    api_key: envVars.cloudinary.api_key,
    api_secret: envVars.cloudinary.api_secret
  });

  // Detect if file is video
  const isVideo = file.mimetype.startsWith("video/");

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.filename,
      resource_type: isVideo ? "video" : "image" // ✅ important for videos
    });
    console.log('Cloudinary upload result:', uploadResult);
    return uploadResult;
  } catch (error) {
    console.log('Cloudinary error:', error);
    return null;
  }
}
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // "image", "video", or "raw"
    });
    console.log("Deleted from Cloudinary:", result);
    return result;
  } catch (err) {
    console.log("Cloudinary deletion error:", err);
    return null;
  }
};
export const fileUploader = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary
};
