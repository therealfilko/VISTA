import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import taskifyLogo from "../assets/taskify_logo.svg";

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
    <div className="min-h-screen bg-black">
      <div className="flex items-center justify-center px-[10%]">
        <Link to="/" className="w-[75px] h-[75px]">
          <img src={taskifyLogo} alt="Taskify" />
        </Link>
      </div>
      <div>
        <div className="flex justify-center items-center py-96 min-w-96">
          <div className="w-80">
            <div className="space-y-2 pb-2">
              <div className="text-4xl text-white">Log In</div>
              <div className="text-lg text-white">
                Schnell und einfach anmelden.
              </div>
            </div>
            <div>
              {error && (
                <p className="text-error text-center text-md py-6">{error}</p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="space-y-3">
                <label htmlFor="email" className="text-white text-xl">
                  Email-Adresse
                </label>
                <br />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-900 text-neutral-400 text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
                  placeholder="Deine Email-Adresse"
                />
              </div>
              <div className="space-y-3 py-3">
                <label htmlFor="passwort" className="text-white text-xl">
                  Passwort
                </label>
                <br />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-neutral-900 text-neutral-400 text-lg placeholder-neutral-600 px-2 py-1 rounded-lg focus:outline-none"
                  placeholder="Dein Passwort"
                />
              </div>
              <div className="text-center space-y-2 pt-6 pb-3 text-lg">
                <button
                  type="submit"
                  className="btn btn-info w-full text-white rounded-lg px-3 py-2 duration-300"
                >
                  Anmelden
                </button>
              </div>
              <div className="text-center py-3 text-lg text-white">
                <div className="py-1">Du hast noch kein Konto?</div>
                <Link
                  to="/register"
                  className="hover:text-info duration-300 py-1"
                >
                  Jetzt registrieren!
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
