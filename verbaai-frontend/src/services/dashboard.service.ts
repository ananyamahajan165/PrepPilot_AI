import API from "../lib/api";

class DashboardService {
  async getDashboardData() {
    const response = await API.get("/dashboard");
    return response.data;
  }

  async getWeeklyProgress() {
    const response = await API.get("/dashboard/weekly-progress");
    return response.data;
  }

  async getStatistics() {
    const response = await API.get("/dashboard/statistics");
    return response.data;
  }

  async getRecentInterviews() {
    const response = await API.get("/dashboard/recent-interviews");
    return response.data;
  }

  async getTodayChallenge() {
    const response = await API.get("/dashboard/today-challenge");
    return response.data;
  }
}

export default new DashboardService();