import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo />
        </nav>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-132px)]">
        {" "}
        <div className="w-full max-w-xs mx-4">
          {" "}
          <div className="space-y-6">
            <h1 className="text-3xl text-white text-center font-semibold">
              Login
            </h1>

            <LoginForm />

            <div className="text-center space-y-2 text-white">
              <p className="text-base">Du hast noch kein Konto?</p>
              <Link
                to="/register"
                className="text-base hover:text-info duration-300 inline-block"
              >
                Jetzt registrieren!
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
