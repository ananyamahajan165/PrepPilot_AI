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
    return response.data;
  }

  async login(data: LoginData) {
    const response = await API.post("/auth/login", data);

    if (response.data?.accessToken) {
      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );
    }

    return response.data;
  }

  async logout() {
    localStorage.removeItem("accessToken");
    return API.post("/auth/logout");
  }

 async getCurrentUser() {
  const response = await API.get("/auth/me");
  return response.data;
}
}

export default new AuthService();