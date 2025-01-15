import Logo from "../components/common/Logo";
import NavLinks from "../components/layout/NavLinks";
import AuthButtons from "../components/common/AuthButtons";

function Start() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="flex items-center justify-center space-x-16 px-10 md:space-x-20 lg:space-x-[15%]">
        <Logo />
        <NavLinks />
        <AuthButtons />
      </div>
    </div>
  );
}

export default Start;
