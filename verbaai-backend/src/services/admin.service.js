import User from "../models/User.js";
import Interview from "../models/Interview.js";

class AdminService {
  async getStatistics() {
    const totalUsers = await User.countDocuments();

    const totalInterviews =
      await Interview.countDocuments();

    const completedInterviews =
      await Interview.countDocuments({
        status: "Completed",
      });

    const averageScore =
      await Interview.aggregate([
        {
          $group: {
            _id: null,
            average: {
              $avg: "$overallScore",
            },
          },
        },
      ]);

    return {
      totalUsers,
      totalInterviews,
      completedInterviews,
      averageScore:
        averageScore.length > 0
          ? Math.round(
              averageScore[0].average
            )
          : 0,
    };
  }

  async getUsers() {
    return User.find().select("-password");
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async getInterviews() {
    return Interview.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }
}

export default new AdminService();