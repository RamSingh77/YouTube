import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload local file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
     console.log("cloudinary Response", uploadResult);
    // console.log("✅ File uploaded successfully:", uploadResult.url);
    fs.unlinkSync(localFilePath)
    return uploadResult;
  } catch (error) {
    console.error("❌ Upload error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// ✅ Upload from remote URL — wrap in async function
const uploadFromURL = async () => {
  try {
    const uploadResult = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
        resource_type: "image",
      }
    );
    console.log("✅ Remote image uploaded:", uploadResult.url);
  } catch (error) {
    console.error("❌ Error uploading remote image:", error);
  }
};

await uploadFromURL(); // Call the remote upload function

// Export the local file uploader
export {uploadOnCloudinary}

