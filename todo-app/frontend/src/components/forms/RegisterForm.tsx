import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [date_of_birth, setDateofbirth] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/register", {
        email,
        password,
        first_name,
        last_name,
        date_of_birth,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registrierungsfehler:", err);
      setError("Registrierung fehlgeschlagen. Versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <label htmlFor="first_name" className="text-white text-base block">
            Vorname
          </label>
          <input
            id="first_name"
            type="text"
            value={first_name}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300 hover:bg-white/10"
            placeholder="Vorname"
          />
        </div>

        <div className="space-y-2 w-1/2">
          <label htmlFor="last_name" className="text-white text-base block">
            Nachname
          </label>
          <input
            id="last_name"
            type="text"
            value={last_name}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300 hover:bg-white/10"
            placeholder="Nachname"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="date_of_birth" className="text-white text-base block">
          Geburtsdatum
        </label>
        <input
          id="date_of_birth"
          type="date"
          value={date_of_birth}
          onChange={(e) => setDateofbirth(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-base
                     placeholder-neutral-600 px-3 py-1.5 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-info
                     transition-all duration-300 hover:bg-white/10"
        />
      </div>

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
          placeholder="Deine Email-Adresse"
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
                     transition-all duration-300 hover:bg-white/10"
          placeholder="Dein Passwort"
        />
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
              Wird registriert...
            </span>
          ) : (
            "Registrieren"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
