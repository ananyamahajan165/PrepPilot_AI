import { createContext } from "react";
import type {
  LoginData,
  RegisterData,
} from "../services/auth.service";

export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);
