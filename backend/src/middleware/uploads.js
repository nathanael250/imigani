import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadDir);
  },
  filename(_req, file, callback) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const allowedTypes = new Set([
  "application/pdf",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function fileFilter(_req, file, callback) {
  if (!allowedTypes.has(file.mimetype)) {
    return callback(new Error("Unsupported file type"));
  }

  return callback(null, true);
}

const upload = multer({
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024,
  },
  storage,
});

export default upload;
