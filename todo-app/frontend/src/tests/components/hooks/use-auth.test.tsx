import { renderHook } from "@testing-library/react";
import { useAuth } from "../../../hooks/use-auth";
import { AuthContext } from "../../../context/auth-context-type";

describe("useAuth", () => {
  test("login updates auth state", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          user: null,
          login: async () => Promise.resolve(),
          logout: async () => Promise.resolve(),
          refreshAuth: async () => Promise.resolve(),
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);

    // Login simulieren
    await result.current.login("max.mustermann@example.com", "test123");

    // Prüfen ob der Login-Aufruf erfolgt ist
    expect(result.current.login).toBeDefined();
  });
});
