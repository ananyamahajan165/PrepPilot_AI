import Notification from "../models/Notification.js";

class NotificationService {
  async create(userId, title, message, type = "System") {
    return Notification.create({
      user: userId,
      title,
      message,
      type,
    });
  }

  async getAll(userId) {
    return Notification.find({
      user: userId,
    }).sort({ createdAt: -1 });
  }

  async markAsRead(id) {
    return Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }
}

export default new NotificationService();