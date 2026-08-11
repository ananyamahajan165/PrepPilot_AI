const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { hashPassword, verifyPassword } = require("../utils/password");
const { success, error } = require("../utils/apiResponse");
const { REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } = require("../utils/cookieConfig");
const { resolveFrontendOrigin } = require("../utils/frontendOrigin");

const MAX_SESSIONS_PER_USER = 5;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshCookieOptions(rememberMe) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,

    sameSite: isProd ? "none" : "lax",
    path: REFRESH_COOKIE_PATH,
    ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
  };
}

async function issueSession(res, user, rememberMe) {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, rememberMe);

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

    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    return error(res, 401, "Refresh token has been revoked");
  }

  const remainingMs = decoded.exp * 1000 - Date.now();
  const rememberMe = remainingMs > 24 * 60 * 60 * 1000;

  const accessToken = await issueSession(res, user, rememberMe);

  return success(res, 200, { token: accessToken });
}

async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const incomingHash = hashToken(token);
      await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: incomingHash } });
    } catch (err) {

    }
  }

  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  return success(res, 200, {}, "Logged out successfully");
}

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

async function googleCallback(req, res) {
  const clientOrigin = resolveFrontendOrigin(req);

  if (!req.user) {
    return res.redirect(`${clientOrigin}/login?error=google_auth_failed`);
  }

  try {

    await issueSession(res, req.user, true);
    return res.redirect(`${clientOrigin}/dashboard`);
  } catch (err) {
    console.error("Google OAuth callback failed after successful Google verification:", err);
    return res.redirect(`${clientOrigin}/login?error=google_auth_failed`);
  }
}

module.exports = { signup, login, refreshToken, logout, getMe, googleCallback };
