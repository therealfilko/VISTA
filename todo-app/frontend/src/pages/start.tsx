import Logo from "../components/common/Logo";
import NavLinks from "../components/layout/NavLinks";
import AuthButtons from "../components/common/AuthButtons";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="min-h-screen bg-[#000000]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8 lg:gap-12">
          <div className="w-[75px] h-[75px] flex-shrink-0">
            <Logo />
          </div>
          <NavLinks />
          <AuthButtons />
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Organisiere deine Aufgaben{" "}
              <span className="text-[#20d760]">effizient</span>
            </h1>
            <p className="text-lg md:text-xl text-[#b3b3b3]">
              Steigere deine Produktivität mit Taskify. Plane, organisiere und
              erreiche deine Ziele.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <button className="bg-[#20d760] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#1db954] transition-all duration-300">
                  Jetzt starten
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121212] p-6 rounded-xl space-y-4">
            <div className="text-[#20d760] text-2xl">✓</div>
            <h3 className="text-xl font-semibold text-white">
              Einfache Organisation
            </h3>
            <p className="text-[#b3b3b3]">
              Erstelle und verwalte deine Aufgaben mit wenigen Klicks
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-xl space-y-4">
            <div className="text-[#20d760] text-2xl">🎯</div>
            <h3 className="text-xl font-semibold text-white">
              Ziele erreichen
            </h3>
            <p className="text-[#b3b3b3]">
              Behalte den Überblick über deine Fortschritte
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-xl space-y-4">
            <div className="text-[#20d760] text-2xl">🔔</div>
            <h3 className="text-xl font-semibold text-white">Erinnerungen</h3>
            <p className="text-[#b3b3b3]">
              Verpasse keine wichtigen Termine und Aufgaben
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#121212] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#20d760]">10k+</div>
              <p className="text-[#b3b3b3]">Aktive Nutzer</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#20d760]">50k+</div>
              <p className="text-[#b3b3b3]">Erledigte Aufgaben</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#20d760]">99%</div>
              <p className="text-[#b3b3b3]">Zufriedene Kunden</p>
            </div>
          </div>
        </section>

        <section className="py-16 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Bereit durchzustarten?
          </h2>
          <p className="text-[#b3b3b3] max-w-2xl mx-auto">
            Registriere dich jetzt kostenlos und entdecke, wie einfach
            Aufgabenverwaltung sein kann.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <button className="bg-[#20d760] text-white px-6 py-2 rounded-lg hover:bg-[#1db954] transition-all duration-300">
                Kostenlos registrieren
              </button>
            </Link>
            <button className="bg-[#121212] text-white px-6 py-2 rounded-lg hover:bg-[#20d760] transition-all duration-300">
              Mehr erfahren
            </button>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t border-[#1f1f1f]">
        <div className="text-center text-[#b3b3b3]">
          <p>© 2025 Taskify. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
};

export default Start;
