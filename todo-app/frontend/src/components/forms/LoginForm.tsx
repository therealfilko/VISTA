import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../common/ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const loginData = {
      email: email,
      password: password,
    };

    try {
      console.log("Sending login data:", loginData);
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        login();
        navigate("/dashboard");
      } else {
        let errorMessage = "Login fehlgeschlagen";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten.");
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
          className="bg-white text-neutral-950 rounded-lg w-full py-2 duration-300 text-lg hover:bg-info hover:text-white"
        >
          Anmelden
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
