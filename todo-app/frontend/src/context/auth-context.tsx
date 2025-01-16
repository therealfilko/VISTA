import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, User } from "./auth-context-type";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/me", {
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
            const response = await fetch("http://localhost:8080/auth/refresh", {
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
    const response = await fetch("http://localhost:8080/auth/login", {
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
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
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
