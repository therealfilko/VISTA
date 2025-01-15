import { Link } from "react-router-dom";
import taskifyLogo from "../assets/taskify_logo.svg";
import { FiChevronDown } from "react-icons/fi";

function Start() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="flex items-center justify-center space-x-16 px-10 md:space-x-20 lg:space-x-[15%]">
        {/* Logo */}
        <Link to="/" className="w-[75px] h-[75px]">
          <img src={taskifyLogo} alt="Taskify" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center justify-center space-x-10">
          <Link
            to="/"
            className="text-white text-md rounded-lg px-3 py-2 flex items-center space-x-1 hover:bg-info hover:text-neutral-950 duration-300"
          >
            <div>Neuigkeiten</div>
            <FiChevronDown />
          </Link>

          <Link
            to="/"
            className="text-white text-md rounded-lg px-3 py-2 flex items-center space-x-1 hover:bg-info hover:text-neutral-950 duration-300"
          >
            <div>Pricing</div>
            <FiChevronDown />
          </Link>

          <Link
            to="/"
            className="text-white text-md rounded-lg px-3 py-2 flex items-center space-x-1 hover:bg-info hover:text-neutral-950 duration-300"
          >
            <div>Kontakt</div>
            <FiChevronDown />
          </Link>
        </div>

        {/* Login & Register Buttons */}
        <div className="flex items-center justify-center space-x-10">
          <Link
            to="/login"
            className="text-white text-md rounded-lg px-3 py-2 hover:bg-info hover:text-neutral-950 duration-300"
          >
            <span>Log In</span>
          </Link>
          <Link
            to="/register"
            className="bg-white text-black text-md rounded-lg px-3 py-2 hover:bg-info hover:text-white duration-300"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
