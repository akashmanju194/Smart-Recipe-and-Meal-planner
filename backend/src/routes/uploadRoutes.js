const express = require("express");
const multer = require("multer");
const { handleImageUpload } = require("../controllers/uploadController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer config — store in memory buffer for Cloudinary streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
    }
  },
});

// POST /api/upload (accessible to anyone for signup avatars)
router.post("/", upload.single("image"), handleImageUpload);

module.exports = router;
