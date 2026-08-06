import API from "../lib/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterData) {
    const response = await API.post("/auth/register", data);
    return response.data?.data || response.data;
  }

  async login(data: LoginData) {
    const response = await API.post("/auth/login", data);
    const payload = response.data?.data || response.data;

    if (payload?.accessToken) {
      localStorage.setItem("accessToken", payload.accessToken);
    }

    return payload;
  }

  async logout() {
    localStorage.removeItem("accessToken");
    const response = await API.post("/auth/logout");
    return response.data?.data || response.data;
  }

 async getCurrentUser() {
  const response = await API.get("/auth/me");
  return response.data?.data || response.data;
}
}

export default new AuthService();