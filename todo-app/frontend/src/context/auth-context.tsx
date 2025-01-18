import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, User } from "./auth-context-type";

const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:9000"  // Lokale Entwicklung
  : `${window.location.protocol}//${window.location.hostname}:9000`; // Produktion

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(
        async () => {
          try {
            const response = await fetch(`${baseURL}/auth/refresh`, {
              method: "POST",
              credentials: "include",
            });
            if (!response.ok) {
              setIsAuthenticated(false);
              setUser(null);
              navigate("/login");
            }
          } catch (err) {
            console.error("Token refresh failed:", err);
            setIsAuthenticated(false);
            setUser(null);
            navigate("/login");
          }
        },
        14 * 60 * 1000,
      );

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, navigate]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log("Login successful:", data);
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
