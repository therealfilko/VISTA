import { Link } from "react-router-dom";
import taskifyLogo from "../../assets/taskify_logo.svg";

const Logo = () => {
  return (
    <Link to="/" className="block w-[75px] h-[75px]">
      <img src={taskifyLogo} alt="Taskify" className="w-full h-full" />
    </Link>
  );
};

export default Logo;
