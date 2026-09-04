const express = require("express");
const { param } = require("express-validator");
const router = express.Router();
const { analyzeResume, getHistory, getReport } = require("../controllers/resumeController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { upload, handleUploadErrors } = require("../middleware/uploadMiddleware");

router.use(protect);

router.post("/analyze", upload.single("resume"), handleUploadErrors, analyzeResume);
router.get("/history", getHistory);
router.get("/history/:id", [param("id").isMongoId().withMessage("Invalid report id")], validate, getReport);

module.exports = router;
