import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-zinc-950 text-lime-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Track List Now 클릭 시 홈으로 이동 */}
        <Link href="/" className="text-xl font-bold">
          Track List Now
        </Link>

        {/* 우측에 Profile과 Login/Logout만 남김 */}
        <nav>
          <ul className="flex space-x-4">
            {/* Profile 링크 */}
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            {/* Login/Logout 버튼 */}
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
