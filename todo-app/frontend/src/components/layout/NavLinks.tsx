import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const NavLinks = () => {
  const { isAuthenticated } = useAuth();

  const links = [
    { to: isAuthenticated ? "/dashboard" : "/", label: "Home" },
    { to: "/", label: "Neuigkeiten" },
    { to: "/", label: "Kontakt" },
  ];

  return (
    <div className="flex items-center justify-center space-x-10">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className="text-white text-md rounded-lg px-3 py-2 flex items-center space-x-1 hover:bg-info hover:text-white duration-300"
        >
          <div>{link.label}</div>
          <FiChevronDown />
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
