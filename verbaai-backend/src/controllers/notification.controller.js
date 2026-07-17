import NotificationService from "../services/notification.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationService.getAll(
    req.user._id
  );

  res.json(
    new ApiResponse(
      200,
      "Notifications fetched successfully",
      notifications
    )
  );
});

export const markNotificationAsRead = asyncHandler(
  async (req, res) => {
    const notification =
      await NotificationService.markAsRead(req.params.id);

    res.json(
      new ApiResponse(
        200,
        "Notification marked as read",
        notification
      )
    );
  }
);