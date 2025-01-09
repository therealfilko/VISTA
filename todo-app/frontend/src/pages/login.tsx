import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importiere Link
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  interface LoginResponse {
    token: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/login",
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login-Fehler:", err);
      setError("Falsche E-Mail oder Passwort.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="absolute top-10 left-10 flex items-center space-x-2 text-white">
        <Link to="/">
          <img src="/accent_logo.svg" alt="Taskify" className="w-11 h-11" />
        </Link>
      </div>

      <div className="w-full max-w-sm bg-transparent p-6">
        <h2 className="text-3xl font-bold text-left mb-15 text-white">
          Schnell und leicht anmelden.
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label
              htmlFor="email"
              className="block text-l py-2 pt-10 font-medium text-white"
            >
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Deine E-Mail"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-l py-2 font-medium text-white"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="w-full text-neutral-950 py-2 rounded-lg btn btn-outline btn-accent"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
