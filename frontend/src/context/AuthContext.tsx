import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { setAccessToken } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];
    const isPublicRoute = publicPaths.includes(window.location.pathname);

    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    // Only attempt silent session restoration on protected routes. Public
    // pages like login/signup should not fire a refresh request just to see
    // whether a cookie exists, which otherwise produces a noisy 401 for
    // users who have not signed in yet.
    async function restoreSession() {
      try {
        const refreshRes = await api.post("/auth/refresh");
        setAccessToken(refreshRes.data.token);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();

    // Fired by lib/api.ts when a background token refresh fails (e.g. the
    // refresh token expired or was revoked from another tab) — drop the
    // user back to a logged-out state immediately.
    function handleSessionExpired() {
      setUser(null);
    }
    window.addEventListener("verbaai:session-expired", handleSessionExpired);
    return () => window.removeEventListener("verbaai:session-expired", handleSessionExpired);
  }, []);

  async function login(email: string, password: string, rememberMe: boolean) {
    const res = await api.post("/auth/login", { email, password, rememberMe });
    setAccessToken(res.data.token);
    const meRes = await api.get("/auth/me");
    setUser(meRes.data.user);
  }

  async function signup(name: string, email: string, password: string, rememberMe: boolean) {
    const res = await api.post("/auth/register", { name, email, password, rememberMe });
    setAccessToken(res.data.token);
    const meRes = await api.get("/auth/me");
    setUser(meRes.data.user);
  }

  async function logout() {
    try {
      // Best-effort: revokes the refresh token server-side and clears the
      // httpOnly cookie. Even if this network call fails (e.g. offline),
      // we still clear local state below so the UI is never stuck "logged in".
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  // Re-fetches /auth/me without touching the refresh token — for callers
  // that already know they're authenticated and just want the latest
  // profile (e.g. after editing name/avatar on the Profile page), as
  // opposed to restoreSession() which is specifically about recovering a
  // session after a page load.
  async function refreshUser() {
    const meRes = await api.get("/auth/me");
    setUser(meRes.data.user);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, signup, logout, setUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
