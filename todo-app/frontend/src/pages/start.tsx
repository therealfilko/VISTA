import Logo from "../components/common/Logo";
import NavLinks from "../components/layout/NavLinks";
import AuthButtons from "../components/common/AuthButtons";

const Start = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="container mx-auto px-4 py-6">
        <nav
          className="flex flex-col items-center justify-between gap-6
                        sm:flex-row sm:gap-8
                        lg:gap-12"
        >
          <div className="w-[75px] h-[75px] flex-shrink-0">
            <Logo />
          </div>

          <NavLinks />
          <AuthButtons />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8"></main>
    </div>
  );
};

export default Start;
