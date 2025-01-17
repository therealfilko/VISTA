import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import RegisterForm from "../components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-[#000000]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center">
          <div className="w-[75px]">
            <Logo />
          </div>
        </nav>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-132px)]">
        <div className="flex w-full max-w-4xl mx-4 bg-[#121212] rounded-2xl overflow-hidden shadow-xl animate-fadeIn motion-reduce:animate-none">
          <div className="hidden md:block w-1/2 bg-[#121212] p-8">
            <div className="h-full flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl text-white font-semibold">
                  Willkommen bei Taskify
                </h2>

                <div className="space-y-4">
                  <div className="group flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-[#1f1f1f]">
                    <div className="text-[#20d760] text-xl group-hover:scale-110 transition-transform">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-white font-medium group-hover:text-[#20d760] transition-colors">
                        Kostenlos starten
                      </h3>
                      <p className="text-sm text-[#b3b3b3]">
                        Erstelle dein Konto und starte sofort durch
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-[#1f1f1f]">
                    <div className="text-[#20d760] text-xl group-hover:scale-110 transition-transform">
                      🔒
                    </div>
                    <div>
                      <h3 className="text-white font-medium group-hover:text-[#20d760] transition-colors">
                        Sicher & Verschlüsselt
                      </h3>
                      <p className="text-sm text-[#b3b3b3]">
                        Deine Daten sind bei uns sicher aufgehoben
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-[#1f1f1f]">
                    <div className="text-[#20d760] text-xl group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-white font-medium group-hover:text-[#20d760] transition-colors">
                        Schnell & Einfach
                      </h3>
                      <p className="text-sm text-[#b3b3b3]">
                        Intuitive Benutzeroberfläche für maximale Produktivität
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1f1f1f] p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#20d760] text-white flex items-center justify-center ring-2 ring-[#121212]">
                      M
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#20d760] text-white flex items-center justify-center ring-2 ring-[#121212]">
                      S
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#20d760] text-white flex items-center justify-center ring-2 ring-[#121212]">
                      L
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-[#b3b3b3]">4.9/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">Wachsende Community</p>
                  <p className="text-sm text-[#b3b3b3]">
                    Schließe dich über 10.000 zufriedenen Nutzern an
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl text-white font-semibold">
                  Erstelle dein Konto
                </h1>
                <p className="text-[#b3b3b3]">
                  Jetzt schnell registrieren und direkt loslegen
                </p>
              </div>

              <RegisterForm />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#121212] text-[#b3b3b3]">
                    Oder registriere dich mit
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="p-2 bg-[#1f1f1f] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                </button>
                <button className="p-2 bg-[#1f1f1f] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-white text-base">
                  Du hast bereits ein Konto?
                </p>
                <Link
                  to="/login"
                  className="text-base text-[#20d760] hover:text-[#2bec6f] duration-300 inline-block"
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
