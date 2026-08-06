const express = require("express");
const { body } = require("express-validator");
const { passport, googleStrategyEnabled } = require("../config/passport");
const router = express.Router();
const { signup, login, refreshToken, logout, getMe, googleCallback } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { error } = require("../utils/apiResponse");

// If GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL aren't set, no "google" strategy
// was ever registered with Passport (see config/passport.js) — calling
// passport.authenticate("google") in that state would otherwise surface as
// an obscure "Unknown authentication strategy" error. This returns a clear,
// actionable message instead, before Passport is ever involved.
function requireGoogleConfigured(req, res, next) {
  if (!googleStrategyEnabled) {
    return error(res, 503, "Google sign-in isn't configured on this server yet.");
  }
  next();
}

function buildFrontendRedirectPath(req, path) {
  const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
  return `${clientOrigin}${path}`;
}

const rememberMeRule = body("rememberMe").optional().isBoolean().withMessage("rememberMe must be a boolean");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  rememberMeRule,
];

const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  rememberMeRule,
];

router.post("/register", authLimiter, registerRules, validate, signup);
router.post("/login", authLimiter, loginRules, validate, login);

// Google OAuth. `session: false` on both calls is what keeps this from
// creating a second, parallel auth system — Passport runs the handshake
// and hands us a verified profile, but never touches req.session or
// express-session; googleCallback then issues our normal JWT session.
router.get(
  "/google",
  authLimiter,
  requireGoogleConfigured,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  requireGoogleConfigured,
  passport.authenticate("google", {
    session: false,
    failureRedirect: buildFrontendRedirectPath({}, "/login?error=google_auth_failed"),
  }),
  googleCallback
);

// No authLimiter here: these aren't credential-guessable (they require a
// valid signed cookie, not a password), and the general apiLimiter already
// covers abuse. No `protect` middleware either — logout/refresh must keep
// working even after the access token has expired, since the whole point of
// the refresh token is to recover from that.
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;
