import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:8080/register", {
        email,
        password,
        username,
      });

      if (response.status === 201) {
        setSuccess(true);
        navigate("/login");
      }
    } catch (err) {
      console.error("Registrierungsfehler:", err);
      setError("Registrierung fehlgeschlagen. Versuche es erneut.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <img src="/tf-logo-2.svg" alt="Taskify Logo" className="w-12 h-12" />

        <p className="text-3xl font-bold text-neutral-100"></p>
      </div>

      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-100">
          Registrieren
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm mb-4">
            Erfolgreich registriert!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm py-2 font-medium text-neutral-100"
            >
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-ghost px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Deine E-Mail"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm py-2 font-medium text-neutral-100"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-ghost px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg btn btn-outline btn-accent"
          >
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
