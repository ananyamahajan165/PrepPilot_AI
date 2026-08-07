import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send/receive the httpOnly refresh-token cookie
});

// The access token lives ONLY in memory (a module-level variable), never in
// localStorage/sessionStorage. This is deliberate: localStorage is readable
// by any script on the page, so a single XSS bug would leak every user's
// token. Keeping it in memory means a page reload loses it — which is fine,
// because AuthContext calls /auth/refresh on startup to get a new one from
// the httpOnly refresh cookie instead.
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

// If a request fails with 401 (expired access token), try exactly once to
// silently refresh it using the httpOnly cookie, then replay the original
// request. If the refresh itself fails, the session is truly over.
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

    // Multiple requests can 401 at once (e.g. Dashboard fires several calls
    // in parallel) — share a single in-flight refresh instead of firing one
    // per failed request.
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
          window.dispatchEvent(new Event("verbaai:session-expired"));
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
