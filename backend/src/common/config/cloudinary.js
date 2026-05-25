// src/common/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();  

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary with quality optimization
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder name
 * @param {Object} options - Optional transformation overrides
 */
export const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        
        // ✅ CORRECT: Separate quality and format parameters
        quality: options.quality || "auto:best",        // Best quality auto-compression
        fetch_format: options.fetch_format || "auto",   // Auto format (WebP/AVIF/JPG)
        
        // ✅ Optional: limit max dimensions for originals
        width: options.width || 2000,                   // Max width
        crop: options.crop || "limit",                  // Scale down, don't crop
        
        // ✅ Retina support
        dpr: options.dpr || "auto",
        
        // ✅ Keep original backup
        backup: true,
        
        // ✅ Optional overrides
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};