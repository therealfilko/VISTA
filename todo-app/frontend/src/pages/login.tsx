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
      <div className="flex items-center justify-center space-x-[20%] px-[15%]">
        <Link to="/" className="w-[100px] h-[100px]">
          <img src={taskifyLogo} alt="Taskify" />
        </Link>
        <div className="flex items-center justify-center space-x-20">
          <Link
            to="/"
            className="text-white text-lg rounded-lg px-3 py-2 hover:bg-neutral-800"
          >
            Neuigkeiten
          </Link>

          <Link
            to="/"
            className="text-white text-lg rounded-lg px-3 py-2 hover:bg-neutral-800"
          >
            Modelle
          </Link>
          <Link
            to="/"
            className="text-white text-lg rounded-lg px-3 py-2 hover:bg-neutral-800"
          >
            Kontakt
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-10">
          <Link
            to="/login"
            className="w-full text-white text-lg rounded-lg px-3 py-2 hover:bg-neutral-800"
          >
            Anmelden
          </Link>
          <Link
            to="/register"
            className="w-full bg-white text-black text-lg rounded-lg px-3 py-2 hover:bg-neutral-200"
          >
            Registrieren
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
