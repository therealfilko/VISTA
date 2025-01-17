import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import RegisterForm from "../components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo />
        </nav>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-132px)]">
        <div className="flex w-full max-w-4xl mx-4 bg-neutral-900/50 rounded-2xl overflow-hidden shadow-2xl">
          {/* Linke Seite - Features/Benefits */}
          <div className="hidden md:block w-1/2 bg-white p-8">
            <div className="h-full flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl text-gray-900 font-semibold">
                  Willkommen bei Taskify
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">🎯</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        Kostenlos starten
                      </h3>
                      <p className="text-sm text-gray-600">
                        Erstelle dein Konto und starte sofort durch
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">🔒</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        Sicher & Verschlüsselt
                      </h3>
                      <p className="text-sm text-gray-600">
                        Deine Daten sind bei uns sicher aufgehoben
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-info text-xl">⚡</div>
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        Schnell & Einfach
                      </h3>
                      <p className="text-sm text-gray-600">
                        Intuitive Benutzeroberfläche für maximale Produktivität
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-info text-white flex items-center justify-center">
                      M
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      S
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      L
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Mehr als 10.000 zufriedene Nutzer
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  ★★★★★{" "}
                  <span className="text-gray-600 text-sm ml-1">
                    4.9/5 Bewertung
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rechte Seite - Register Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl text-white font-semibold">
                  Erstelle dein Konto
                </h1>
                <p className="text-neutral-400">
                  Nur noch wenige Schritte bis zu deiner ersten Todo-Liste
                </p>
              </div>

              <RegisterForm />

              <div className="text-center space-y-2 text-white">
                <p className="text-base">Du hast bereits ein Konto?</p>
                <Link
                  to="/login"
                  className="text-base hover:text-info duration-300 inline-block"
                >
                  Jetzt anmelden!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
