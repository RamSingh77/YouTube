import { v2 as cloudinary } from "cloudinary";

/**
 * Deletes an image from Cloudinary using the image's URL
 * @param {string} imageUrl - Full Cloudinary image URL
 * @returns {object|null} - Deletion result or null on failure
 */
const deleteImageCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length !== 2) {
      throw new Error("Invalid Cloudinary URL format");
    }

    // ✅ Remove version and file extension
    const pathAfterUpload = urlParts[1]; // e.g., v1744799223/kv1nylml1xjsggucy0wz.png
    const withoutExtension = pathAfterUpload.split(".").slice(0, -1).join(".");
    const publicId = withoutExtension.replace(/^v\d+\//, ""); // Remove version prefix

    console.log("Deleting public_id from Cloudinary:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    return null;
  }
};

export { deleteImageCloudinary };
