const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  deleteAccount,
} = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);

const MAX_AVATAR_DATA_URL_LENGTH = 4_200_000;

router.get("/", getProfile);

router.put(
  "/",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("bio").optional().isString().isLength({ max: 300 }).withMessage("Bio must be 300 characters or fewer"),
    body("college").optional().isString().isLength({ max: 150 }).withMessage("College must be 150 characters or fewer"),
    body("branch").optional().isString().isLength({ max: 150 }).withMessage("Branch must be 150 characters or fewer"),
    body("skills").optional(),
    body("github")
      .optional({ checkFalsy: true })
      .isURL({ require_protocol: false })
      .withMessage("GitHub must be a valid URL"),
    body("linkedin")
      .optional({ checkFalsy: true })
      .isURL({ require_protocol: false })
      .withMessage("LinkedIn must be a valid URL"),
  ],
  validate,
  updateProfile
);

router.put(
  "/password",
  [
    body("currentPassword").notEmpty().withMessage("currentPassword is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validate,
  changePassword
);

router.put(
  "/avatar",
  [
    body("avatarDataUrl")
      .matches(/^data:image\/(png|jpe?g|gif|webp);base64,/i)
      .withMessage("A valid image data URL is required")
      .isLength({ max: MAX_AVATAR_DATA_URL_LENGTH })
      .withMessage("Image is too large — please use a photo under 3MB"),
  ],
  validate,
  updateAvatar
);

router.delete(
  "/",
  [body("password").optional().isString()],
  validate,
  deleteAccount
);

module.exports = router;