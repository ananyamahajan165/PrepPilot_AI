import AdminService from "../services/admin.service.js";

import ApiResponse from "../utils/ApiResponse.js";

import ApiError from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(
  async (req, res) => {
    const stats =
      await AdminService.getStatistics();

    res.json(
      new ApiResponse(
        200,
        "Admin dashboard",
        stats
      )
    );
  }
);

export const users = asyncHandler(
  async (req, res) => {
    const data =
      await AdminService.getUsers();

    res.json(
      new ApiResponse(
        200,
        "Users fetched",
        data
      )
    );
  }
);

export const deleteUser =
  asyncHandler(async (req, res) => {
    const user =
      await AdminService.deleteUser(
        req.params.id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    res.json(
      new ApiResponse(
        200,
        "User deleted"
      )
    );
  });

export const interviews = asyncHandler(
  async (req, res) => {
    const data =
      await AdminService.getInterviews();

    res.json(
      new ApiResponse(
        200,
        "Interviews fetched",
        data
      )
    );
  }
);