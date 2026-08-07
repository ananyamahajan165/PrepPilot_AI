const multer = require("multer");
const { error } = require("../utils/apiResponse");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Route-level error handler for the upload step specifically. Both
// multer's own errors (e.g. LIMIT_FILE_SIZE) and our fileFilter's plain
// Error arrive here without a statusCode, so the app-wide centralized
// error handler in app.js would otherwise treat them as unexpected 5xx
// failures and mask them behind a generic "Internal server error" —
// these are genuine, expected 4xx client input problems and should say so.
function handleUploadErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return error(res, 400, "File must be under 5MB");
    }
    return error(res, 400, err.message);
  }
  if (err && err.message === "Only PDF files are allowed") {
    return error(res, 400, err.message);
  }
  next(err);
}

module.exports = { upload, handleUploadErrors };
