import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import LoginForm from "../components/common/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="flex items-center justify-center px-[10%]">
        <Logo />
      </div>

      <div>
        <div className="flex justify-center items-center py-72 min-w-96">
          <div className="w-96">
            <div className="space-y-2 pb-3">
              <div className="text-5xl text-white">Log In</div>
              <div className="text-lg text-white pt-2">
                Schnell und einfach einloggen.
              </div>
            </div>

            <LoginForm />

            <div className="text-center py-3 text-lg text-white">
              <div className="py-1">Du hast noch kein Konto?</div>
              <Link
                to="/register"
                className="hover:text-info duration-300 py-1"
              >
                Jetzt registrieren!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
