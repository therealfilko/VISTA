import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../../../components/forms/LoginForm";

// Mock useNavigate und useLocation
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: { pathname: "/dashboard" } } }),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Mock useAuth
const mockAuthContext = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  refreshAuth: jest.fn(),
};

jest.mock("../../../hooks/use-auth", () => ({
  useAuth: () => mockAuthContext,
}));

describe("LoginForm", () => {
  test("handles login form submission", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "max.mustermann@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/passwort/i), {
      target: { value: "test123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /anmelden/i }));

    // Warte auf das Ende des asynchronen Updates
    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith(
        "max.mustermann@example.com",
        "test123"
      );
    });
  });
});
