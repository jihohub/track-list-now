import LanguageToggle from "@/features/common/LanguageToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleProfileClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status === "authenticated") {
      router.push("/profile");
    } else {
      await signIn();
    }
  };

  return (
    <header className="sticky bg-zinc-950 text-vividSkyBlue p-4 top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Track List Now
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <LanguageToggle />
            </li>
            <li className="md:block hidden">
              <button
                onClick={handleProfileClick}
                type="button"
                aria-label="Go to your profile"
              >
                Profile
              </button>
            </li>
            <li className="md:block hidden">
              {status === "authenticated" ? (
                <button
                  onClick={() => signOut()}
                  type="button"
                  aria-label="Logout"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  type="button"
                  aria-label="Login"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
