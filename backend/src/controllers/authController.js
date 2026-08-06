const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { hashPassword, verifyPassword } = require("../utils/password");
const { success, error } = require("../utils/apiResponse");
const { REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } = require("../utils/cookieConfig");
const { resolveFrontendOrigin } = require("../utils/frontendOrigin");

const MAX_SESSIONS_PER_USER = 5; // cap concurrent devices/sessions

// Refresh tokens are high-entropy JWTs already, so a fast SHA-256 fingerprint
// (not bcrypt) is the right tool here — bcrypt's slow work factor is for
// low-entropy human passwords, not for comparing already-random tokens.
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshCookieOptions(rememberMe) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // never readable by client-side JS (XSS protection)
    secure: isProd, // HTTPS only in production
    // Frontend and backend live on different domains in production
    // (e.g. Vercel + Render), so the cookie must be SameSite=None there.
    // Locally everything is same-origin (Vite proxy), so Lax works and
    // doesn't require HTTPS.
    sameSite: isProd ? "none" : "lax",
    path: REFRESH_COOKIE_PATH,
    ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}), // else: session cookie
  };
}

async function issueSession(res, user, rememberMe) {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, rememberMe);

  // Persist only the hash, and cap how many sessions a single user can hold.
  // This uses an atomic $push with $slice so concurrent refresh/login
  // requests cannot race and leave the document in a stale state.
  await User.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        $each: [hashToken(refreshToken)],
        $slice: -MAX_SESSIONS_PER_USER,
      },
    },
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(rememberMe));
  return accessToken;
}

// POST /api/auth/register
// (input shape already validated by registerRules in authRoutes.js)
async function signup(req, res) {
  const { name, email, password, rememberMe } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return error(res, 409, "An account with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
  const accessToken = await issueSession(res, user, Boolean(rememberMe));

  return success(res, 201, {
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
}

// POST /api/auth/login
// (input shape already validated by loginRules in authRoutes.js)
async function login(req, res) {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return error(res, 401, "Invalid email or password");
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return error(res, 401, "Invalid email or password");
  }

  const accessToken = await issueSession(res, user, Boolean(rememberMe));

  return success(res, 200, {
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
}

// POST /api/auth/refresh
// Reads the httpOnly refresh cookie, verifies + rotates it, and mints a new
// short-lived access token. This is what lets a session survive a page
// reload (or outlive a 15-minute access token) without re-entering a password.
async function refreshToken(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    return error(res, 401, "No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    return error(res, 401, "Invalid or expired refresh token");
  }

  const incomingHash = hashToken(token);
  const user = await User.findOneAndUpdate(
    { _id: decoded.id, refreshTokens: incomingHash },
    { $pull: { refreshTokens: incomingHash } },
    { new: true, select: "+refreshTokens" }
  );

  if (!user) {
    // Token looked valid but isn't a currently-active session — it was
    // already logged out, or (worse) this is a replayed/stolen token.
    // Either way: refuse it and clear the cookie.
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    return error(res, 401, "Refresh token has been revoked");
  }

  // "Remember me" isn't encoded in the token payload, so a rotated session
  // keeps the same lifetime class it was issued with by re-reading the
  // original token's expiry window relative to now (long-lived tokens have
  // more than 1 day left; short-lived ones don't).
  const remainingMs = decoded.exp * 1000 - Date.now();
  const rememberMe = remainingMs > 24 * 60 * 60 * 1000;

  const accessToken = await issueSession(res, user, rememberMe);

  return success(res, 200, { token: accessToken });
}

// POST /api/auth/logout
// Best-effort and idempotent: revokes just this device's refresh token and
// always clears the cookie, even if the token was already invalid/expired.
async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const incomingHash = hashToken(token);
      await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: incomingHash } });
    } catch (err) {
      // Token already invalid/expired — nothing to revoke, still clear the cookie below.
    }
  }

  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  return success(res, 200, {}, "Logged out successfully");
}

// GET /api/auth/me
async function getMe(req, res) {
  return success(res, 200, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
    },
  });
}

// GET /api/auth/google/callback
// Runs after passport.authenticate("google", { session: false }) has
// already verified the Google profile and attached the resulting user to
// req.user (see config/passport.js for the actual account lookup/creation).
// This handler's only job is to issue OUR session — the exact same
// access+refresh token pair email/password login produces — and hand the
// browser back to the frontend.
//
// Deliberately NOT using the normal JSON success()/error() helpers here:
// this route is reached by a real browser navigation (Google redirecting
// the user's address bar), not an XHR/fetch call, so the response must be
// an HTTP redirect either way, never a JSON body. Every failure path below
// redirects to the frontend with an error flag instead of throwing —
// letting an error escape here would otherwise hit the app-wide JSON error
// handler and leave the user staring at raw JSON instead of back on the
// login page.
async function googleCallback(req, res) {
  const clientOrigin = resolveFrontendOrigin(req);

  if (!req.user) {
    return res.redirect(`${clientOrigin}/login?error=google_auth_failed`);
  }

  try {
    // One-click social login is expected to behave like "remember me" —
    // there's no checkbox in this flow to ask the user, and persistent
    // login is the standard UX for OAuth sign-in.
    await issueSession(res, req.user, true);
    return res.redirect(`${clientOrigin}/dashboard`);
  } catch (err) {
    console.error("Google OAuth callback failed after successful Google verification:", err);
    return res.redirect(`${clientOrigin}/login?error=google_auth_failed`);
  }
}

module.exports = { signup, login, refreshToken, logout, getMe, googleCallback };
