import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

function Start() {
  return (
    <div className="min-h-screen bg-black">
      <div className="flex items-center justify-center space-x-[20%] px-[15%] py-[1%]">
        <Link to="/" className="w-[4%] h-[4%]">
          <img src="/taskify_logo.svg" alt="Taskify" />
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
}

export default Start;
