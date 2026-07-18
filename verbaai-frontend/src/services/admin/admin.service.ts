import API from "../../lib/api";

export type AdminDashboardStats = {
  totalUsers: number;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  college?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
};

class AdminService {
  async getDashboard() {
    const response = await API.get("/admin/dashboard");
    return response.data;
  }

  async getUsers() {
    const response = await API.get("/admin/users");
    return response.data;
  }

  async getInterviews() {
    const response = await API.get("/admin/interviews");
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  }
}

export default new AdminService();
