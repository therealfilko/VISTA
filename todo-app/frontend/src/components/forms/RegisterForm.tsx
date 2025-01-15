import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [date_of_birth, setDateofbirth] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-error text-center text-md py-1">{error}</p>}

      <div className="space-y-3">
        <div className="flex space-x-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="first_name" className="text-white text-lg mb-2">
              Vorname
            </label>
            <input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
              placeholder="Dein Vorname"
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="last_name" className="text-white text-lg mb-2">
              Nachname
            </label>
            <input
              id="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
              placeholder="Dein Nachname"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="date_of_birth" className="text-white text-lg">
          Geburtsdatum
        </label>
        <input
          id="date_of_birth"
          type="text"
          value={date_of_birth}
          onChange={(e) => setDateofbirth(e.target.value)}
          required
          className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
          placeholder="jjjj.tt.mm"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="email" className="text-white text-lg">
          Email-Adresse
        </label>
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

      {/* Passwort */}
      <div className="space-y-3">
        <label htmlFor="password" className="text-white text-lg">
          Passwort
        </label>
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
          Registrieren
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
