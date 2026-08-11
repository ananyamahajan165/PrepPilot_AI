import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;
    const isAuthRoute = originalRequest?.url?.includes("/auth/");

    if (status !== 401 || isAuthRoute || originalRequest._retry) {
      return Promise.reject(err);
    }
    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post("/auth/refresh")
        .then((res) => {
          const newToken = res.data.token as string;
          setAccessToken(newToken);
          return newToken;
        })
        .catch(() => {
          setAccessToken(null);
          window.dispatchEvent(new Event("preppilot-ai:session-expired"));
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;
    if (!newToken) return Promise.reject(err);

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);

export default api;
