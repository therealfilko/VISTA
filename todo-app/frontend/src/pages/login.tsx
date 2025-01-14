import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  interface LoginResponse {
    token: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        login(response.data.token); // AuthContext-Funktion aufrufen
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login-Fehler:", err);
      setError("Falsche E-Mail oder Passwort.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="absolute top-7 left-7 flex items-center">
        <Link to="/">
          <img src="/taskify_logo.svg" alt="Taskify" className="" />
        </Link>
      </div>

      <div className="w-full max-w-sm p-6">
        <h2 className="text-3xl font-bold text-center pb-5 text-white">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm pb-4 pt-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label
              htmlFor="email"
              className="block text-l py-2 pt-4 font-medium text-white"
            >
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
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
              className="w-full text-white bg-neutral-900 px-3 py-2 border rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="w-full text-neutral-950 py-2 rounded-lg btn btn-outline btn-info"
          >
            Anmelden
          </button>
          <div className="text-white text-center">
            Du hast noch kein Konto?
            <p className="pt-2 text-white font-semibold hover:text-info">
              <a href="/register">Jetzt registrieren!</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
