import API from "../lib/api";

class AdminService {
  async getDashboard() {
    const response = await API.get("/admin/dashboard");
    return response.data;
  }

  async getUsers() {
    const response = await API.get("/admin/users");
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  }
}

export default new AdminService();
