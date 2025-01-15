import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "./ErrorMessage";

interface LoginResponse {
  token: string; // Typisierung des Rückgabewerts vom Server
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

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
          className="btn btn-info text-white rounded-lg w-full py-2 duration-300 text-lg"
        >
          Anmelden
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
