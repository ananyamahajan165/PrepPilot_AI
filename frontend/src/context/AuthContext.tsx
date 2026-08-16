import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
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

  const hasRestoredSession = useRef(false);

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];
    const isPublicRoute = publicPaths.includes(window.location.pathname);

    if (isPublicRoute) {
      setLoading(false);
      return;
    }

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

    if (!hasRestoredSession.current) {
      hasRestoredSession.current = true;
      restoreSession();
    }

    function handleSessionExpired() {
      setUser(null);
    }
    window.addEventListener("preppilot-ai:session-expired", handleSessionExpired);
    return () => window.removeEventListener("preppilot-ai:session-expired", handleSessionExpired);
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

      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

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
