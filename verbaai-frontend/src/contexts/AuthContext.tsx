import {
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import AuthService from "../services/auth.service";
import type {
  LoginData,
  RegisterData,
} from "../services/auth.service";
import { AuthContext } from "./auth.context";
import type { User } from "./auth.context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await AuthService.getCurrentUser();
      setUser(data.user || data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    const response = await AuthService.login(data);

    if (response.user) {
      setUser(response.user);
    } else {
      await checkAuth();
    }
  };

  const register = async (data: RegisterData) => {
    const response = await AuthService.register(data);

    if (response.user) {
      setUser(response.user);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
