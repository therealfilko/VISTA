import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
                     transition-all duration-300"
          placeholder="Deine Email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-white text-base block">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300"
          placeholder="Dein Passwort"
        />
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-white text-neutral-950 rounded-lg
                     py-2 text-base font-medium
                     transition-all duration-300
                     ${
                       isLoading
                         ? "opacity-50 cursor-not-allowed"
                         : "hover:bg-info hover:text-white"
                     }`}
        >
          {isLoading ? "Wird angemeldet..." : "Anmelden"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
