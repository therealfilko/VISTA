import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import ErrorMessage from "../common/ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const from = (location.state?.from?.pathname as string) || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-2">
        <label htmlFor="email" className="text-white text-base block">
          Email-Adresse
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300 hover:bg-white/10"
          placeholder="Deine Email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-white text-base block">
            Passwort
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-info hover:text-info/80 transition-colors"
          >
            Passwort vergessen?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300 hover:bg-white/10"
          placeholder="Dein Passwort"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          className="mr-2 rounded border-neutral-600"
        />
        <label htmlFor="remember" className="text-sm text-neutral-400">
          Angemeldet bleiben
        </label>
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full relative bg-white text-neutral-950 rounded-lg
                     py-2 text-base font-medium
                     transition-all duration-300
                     ${isLoading ? "opacity-80" : "hover:bg-info hover:text-white"}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Wird angemeldet...
            </span>
          ) : (
            "Anmelden"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
