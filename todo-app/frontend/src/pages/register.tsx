import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [date_of_birth, setDateofbirth] = useState("");
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
        first_name,
        last_name,
        date_of_birth,
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
      <div className="absolute top-7 left-7 flex items-center">
        <Link to="/">
          <img src="/taskify_logo.svg" alt="Taskify" className="w-10 h-10" />
        </Link>
      </div>

      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center pb-5 text-white">
          Registrierung
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm pb-4 pt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm mb-4">
            Erfolgreich registriert!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-l py-2 font-medium text-white"
              >
                Vorname
              </label>
              <input
                id="first_name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
                placeholder="Dein Vorname"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-l py-2 font-medium text-white"
              >
                Nachname
              </label>
              <input
                id="last_name"
                type="text"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
                placeholder="Dein Nachname"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-l py-2 pt-4 font-medium text-white"
            >
              Geburtstag
            </label>
            <input
              id="date_of_birth"
              type="text"
              value={date_of_birth}
              onChange={(e) => setDateofbirth(e.target.value)}
              required
              className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
              placeholder="tt.mm.jjjj"
            />
          </div>

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
              className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
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
              className="w-full text-white bg-neutral-900 px-3 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-info placeholder-neutral-400"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="w-full text-neutral-950 py-2 rounded-lg btn btn-outline btn-info"
          >
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
