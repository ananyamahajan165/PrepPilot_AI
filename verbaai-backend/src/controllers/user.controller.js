import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Get User Profile
 */

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", user)
  );
});

/**
 * Update User Profile
 */

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    college,
    branch,
    graduationYear,
    bio,
    profilePic,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = name ?? user.name;
  user.college = college ?? user.college;
  user.branch = branch ?? user.branch;
  user.graduationYear =
    graduationYear ?? user.graduationYear;
  user.bio = bio ?? user.bio;
  user.profilePic = profilePic ?? user.profilePic;

  await user.save();

  const updatedUser = await User.findById(user._id).select(
    "-password"
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Profile updated successfully",
      updatedUser
    )
  );
});

/**
 * Delete User
 */

export const deleteProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Account deleted successfully")
  );
});