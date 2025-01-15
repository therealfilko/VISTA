import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import taskifyLogo from "../assets/taskify_logo.svg";

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
    <div className="min-h-screen bg-neutral-950">
      <div className="flex items-center justify-center px-[10%]">
        <Link to="/" className="w-[75px] h-[75px]">
          <img src={taskifyLogo} alt="Taskify" />
        </Link>
      </div>
      <div>
        <div className="flex justify-center items-center py-72">
          <div className="w-[25%] space-y-3">
            <div className="space-y-2 pb-3">
              <div className="text-5xl text-white">Sign Up</div>
              <div className="text-lg text-white pt-2">
                Schnell und einfach registrieren.
              </div>
            </div>
            <form onSubmit={handleSubmit} className="py-3 space-y-4">
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="first_name"
                      className="text-white text-lg mb-2"
                    >
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

                  {/* Nachname */}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="last_name"
                      className="text-white text-lg mb-2"
                    >
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
                <br />
                <input
                  id="date_of_birth"
                  type="text"
                  value={date_of_birth}
                  onChange={(e) => setDateofbirth(e.target.value)}
                  required
                  className="w-full bg-white/5 text-white text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
                  placeholder="tt.mm.jjjj"
                />
              </div>

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
                <label htmlFor="passwort" className="text-white text-lg">
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
                  Registrieren
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
