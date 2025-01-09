import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      <div className="absolute top-10 left-10 flex items-center space-x-2">
        {/* Logo mit Link zur Startseite */}
        <Link to="/">
          <img src="/accent_logo.svg" alt="Taskify" className="w-11 h-11" />
        </Link>
      </div>

      <div className="w-full max-w-sm bg-transparent p-6">
        <h2 className="text-3xl font-bold text-left mb-6 text-white">
          Schnell und leicht registrieren.
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm mb-4">
            Erfolgreich registriert!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label
              htmlFor="email"
              className="block text-sm py-2 font-medium text-white"
            >
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Deine E-Mail"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm py-2 font-medium text-white"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-neutral-500"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="w-full text-neutral-950 py-2 rounded-lg btn btn-outline btn-accent"
          >
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
