import { Link } from "react-router-dom";

const AuthButtons = () => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Link
        to="/login"
        className="text-white text-md px-4 py-2 rounded-lg hover:bg-[#121212] transition-all duration-300 flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        <span>Log In</span>
      </Link>

      <Link
        to="/register"
        className="bg-[#20d760] text-white text-md px-4 py-2 rounded-lg hover:bg-[#1db954] transition-all duration-300 flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span>Sign Up</span>
      </Link>
    </div>
  );
};

export default AuthButtons;
