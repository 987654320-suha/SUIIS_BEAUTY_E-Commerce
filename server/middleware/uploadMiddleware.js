import multer from "multer";
import path from "path";
import fs from "fs";

// ─── Directory setup ──────────────────────────────────────────────────────────
const UPLOAD_DIR = "uploads/skin";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Storage: save to disk with timestamp + user-scoped name ─────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

  filename: (req, file, cb) => {
    // e.g.  skin_u001_1715000000000.jpg
    const userId = req.user?._id?.toString() ?? "anon";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `skin_${userId}_${Date.now()}${ext}`);
  },
});

// ─── Only allow images ────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG and WEBP images are allowed."),
      false
    );
  }
};

// ─── Export configured multer instance ────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max — prevents abuse
    files: 1,
  },
});

// ─── Multer error handler middleware (use after any upload route) ─────────────
export const handleUploadError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, message: "Image too large. Max size is 10 MB." });
    }
    return res
      .status(400)
      .json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res
      .status(400)
      .json({ success: false, message: err.message });
  }
  next();
};

export default upload;