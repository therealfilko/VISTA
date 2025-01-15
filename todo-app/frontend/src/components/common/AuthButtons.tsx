import { Link } from "react-router-dom";

const AuthButtons = () => {
  return (
    <div className="flex items-center justify-center space-x-8">
      <Link
        to="/login"
        className="text-white text-md rounded-lg px-3 py-2 hover:bg-info hover:text-white duration-300"
      >
        <span>Log In</span>
      </Link>
      <Link
        to="/register"
        className="bg-white text-neutral-950 text-md rounded-lg px-3 py-2 hover:bg-info hover:text-white duration-300"
      >
        <span>Sign In</span>
      </Link>
    </div>
  );
};

export default AuthButtons;
