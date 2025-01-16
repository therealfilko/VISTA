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
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-3 space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-3">
        <label htmlFor="email" className="text-white text-lg">
          Email-Adresse
        </label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
          placeholder="Deine Email-Adresse"
        />
      </div>

      <div className="space-y-3 py-3">
        <label htmlFor="password" className="text-white text-lg">
          Passwort
        </label>
        <br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
          placeholder="Dein Passwort"
        />
      </div>

      <div className="text-center space-y-2 pt-6 pb-3 text-lg">
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-white text-neutral-950 rounded-lg w-full py-2 duration-300 text-lg
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
