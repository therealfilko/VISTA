import { createContext } from "react";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
