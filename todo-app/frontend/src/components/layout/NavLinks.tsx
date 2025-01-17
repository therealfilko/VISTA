import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

const NavLinks = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const links = [
    {
      to: "/",
      label: "Neuigkeiten",
      dropdownItems: ["Blog", "Updates", "Newsletter"],
    },
    {
      to: "/",
      label: "Modelle",
      dropdownItems: ["Übersicht", "Features", "Lösungen"],
    },
    {
      to: "/",
      label: "Kontakt",
      dropdownItems: ["Support", "FAQ", "Feedback"],
    },
  ];

  return (
    <div className="flex items-center justify-center space-x-10">
      {links.map((link, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setActiveDropdown(index)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <Link
            to={link.to}
            className="text-white text-md rounded-lg px-3 py-2 flex items-center space-x-1 hover:bg-[#121212] duration-300"
          >
            <span>{link.label}</span>
            <FiChevronDown
              className={`transform transition-transform duration-200 ${activeDropdown === index ? "rotate-180" : ""}`}
            />
          </Link>

          {activeDropdown === index && (
            <div className="absolute left-0 mt-1 w-48 py-2 bg-[#121212] rounded-lg shadow-xl border border-[#1f1f1f] animate-fadeIn">
              {link.dropdownItems.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to="#"
                  className="block px-4 py-2 text-sm text-[#b3b3b3] hover:bg-[#20d760] hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
