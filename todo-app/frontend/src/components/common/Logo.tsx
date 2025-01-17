import { Link } from "react-router-dom";
import taskifyLogo from "../../assets/taskify_logo.svg";

const Logo = () => {
  return (
    <Link to="/" className="block w-[60px] h-[60px]">
      <img src={taskifyLogo} alt="Taskify" className="w-full h-full" />
    </Link>
  );
};

export default Logo;
