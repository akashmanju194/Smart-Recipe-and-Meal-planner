const cloudinary = require("../config/cloudinary");

/**
 * POST /api/upload
 * Upload an image to Cloudinary and return the URL.
 * Expects a file in req.file (via multer middleware).
 */
const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "smart-recipe",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleImageUpload };
