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
        <div className="flex w-full max-w-4xl mx-4 bg-neutral-900/50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="w-full md:w-1/2 p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl text-white font-semibold">
                  Willkommen zurück!
                </h1>
                <p className="text-neutral-400">
                  Melde dich an und organisiere deine Aufgaben
                </p>
              </div>

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

          <div className="hidden md:block w-1/2 bg-white p-8">
            {" "}
            <div className="h-full flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl text-gray-900 font-semibold">
                  {" "}
                  Deine Vorteile
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">✓</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        {" "}
                        Aufgaben organisieren
                      </h3>
                      <p className="text-sm text-gray-600">
                        {" "}
                        Behalte den Überblick über alle deine ToDos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">✓</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        {" "}
                        Fortschritt tracken
                      </h3>
                      <p className="text-sm text-gray-600">
                        {" "}
                        Verfolge deinen Fortschritt in Echtzeit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">✓</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        {" "}
                        Erinnerungen
                      </h3>
                      <p className="text-sm text-gray-600">
                        {" "}
                        Verpasse keine wichtigen Deadlines
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                {" "}
                <p className="text-gray-700 italic">
                  {" "}
                  "Taskify hat meine Produktivität verdoppelt! Die beste
                  Todo-App, die ich je benutzt habe."
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {" "}
                  - Max Mustermann, Produktmanager
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
