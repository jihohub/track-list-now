import navItems from "@/constants/navItems";
import LanguageToggle from "@/features/common/components/LanguageToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface NavigationLinksProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

const NavigationLinks = ({
  isMobile = false,
  closeMenu,
}: NavigationLinksProps) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile && closeMenu) closeMenu();
  };

  return (
    <>
      {isMobile && (
        <li>
          <LanguageToggle />
        </li>
      )}
      {navItems.map((item) => (
        <li key={item.label} className={isMobile ? "w-full" : undefined}>
          <button
            onClick={() => handleNavigation(item.href)}
            type="button"
            aria-label={`Go to ${item.label} page`}
            className={`text-left w-full hover:text-white ${isMobile ? "py-2" : ""}`}
          >
            {item.label}
          </button>
        </li>
      ))}
      <li className={isMobile ? "w-full" : undefined}>
        {status === "authenticated" ? (
          <button
            onClick={() => {
              signOut();
              if (isMobile && closeMenu) closeMenu();
            }}
            type="button"
            aria-label="Logout"
            className={`text-left w-full hover:text-white ${isMobile ? "py-2" : ""}`}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              signIn();
              if (isMobile && closeMenu) closeMenu();
            }}
            type="button"
            aria-label="Login"
            className={`text-left w-full hover:text-white ${isMobile ? "py-2" : ""}`}
          >
            Login
          </button>
        )}
      </li>
    </>
  );
};

export default NavigationLinks;
