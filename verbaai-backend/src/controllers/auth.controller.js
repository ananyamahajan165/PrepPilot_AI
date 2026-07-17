import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

/**
 * Register User
 */

export const register = asyncHandler(async (req, res) => {
  console.log("Register request received");
  console.log(req.body);

  const { name, email, password } = req.body;

  console.log("Checking existing user...");
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  console.log("Creating user...");
  const user = await User.create({
    name,
    email,
    password,
  });

  console.log("User created:", user._id);

  console.log("Generating access token...");
  const accessToken = generateAccessToken(user);

  console.log("Generating refresh token...");
  const refreshToken = generateRefreshToken(user);

  console.log("Saving refresh token...");
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Sending response...");

  res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user,
      accessToken,
      refreshToken,
    })
  );
});

/**
 * Login
 */

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.lastLogin = new Date();

  await user.save();

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
  });

  res.json(
    new ApiResponse(200, "Login successful", {
      user,
      accessToken,
      refreshToken,
    })
  );
});

/**
 * Logout
 */

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;

  await RefreshToken.deleteOne({
    token: refreshToken,
  });

  res.json(
    new ApiResponse(
      200,
      "Logged out successfully"
    )
  );
});

/**
 * Refresh Token
 */

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(
      401,
      "Refresh token required"
    );
  }

  verifyRefreshToken(refreshToken);

  const storedToken =
    await RefreshToken.findOne({
      token: refreshToken,
    });

  if (!storedToken) {
    throw new ApiError(
      401,
      "Invalid refresh token"
    );
  }

  const user = await User.findById(
    storedToken.user
  );

  const accessToken =
    generateAccessToken(user);

  res.json(
    new ApiResponse(200, "Token refreshed", {
      accessToken,
    })
  );
});

/**
 * Current User
 */

export const currentUser = asyncHandler(
  async (req, res) => {
    res.json(
      new ApiResponse(200, "Current user", req.user)
    );
  }
);