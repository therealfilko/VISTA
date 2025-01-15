import { Link } from "react-router-dom";
import taskifyLogo from "../assets/taskify_logo.svg";
import RegisterForm from "../components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="flex items-center justify-center px-[10%] py-8">
        <Link to="/" className="w-[75px] h-[75px]">
          <img src={taskifyLogo} alt="Taskify" />
        </Link>
      </div>
      <div className="flex justify-center items-center py-16">
        <div className="w-[25%] space-y-6">
          <div className="space-y-3 pb-3">
            <div className="text-5xl text-white text-center">Sign Up</div>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
