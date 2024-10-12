// /components/Header.tsx
import LanguageToggle from "@/features/common/LanguageToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-zinc-950 text-lime-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Track List Now
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <LanguageToggle />
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              {status === "authenticated" ? (
                <button onClick={() => signOut()}>Logout</button>
              ) : (
                <button onClick={() => signIn()}>Login</button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
