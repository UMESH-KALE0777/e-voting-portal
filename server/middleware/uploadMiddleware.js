// server/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store images directly on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "securevote/candidates",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const mimeOk = allowedMimeTypes.includes(file.mimetype);
  const extOk  = allowedExtensions.includes(ext);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only JPG, PNG, and WEBP images are allowed.";
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});

export default upload;