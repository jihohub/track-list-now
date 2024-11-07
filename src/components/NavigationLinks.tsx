import { DESKTOP_NAV_ITEMS } from "@/constants/navigation";
import LanguageToggle from "@/features/common/components/LanguageToggle";
import useNavigation from "@/hooks/useNavigation";
import { NavigationProps } from "@/types/navigation";
import { signIn, signOut } from "next-auth/react";

const NavigationLinks = ({ isMobile = false, closeMenu }: NavigationProps) => {
  const { handleNavigation, isAuthenticated, isLoading } = useNavigation();

  const handleAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      await signOut({ callbackUrl: "/" });
    } else {
      await signIn();
    }
    if (isMobile && closeMenu) closeMenu();
  };

  if (isLoading) return null;

  return (
    <>
      {isMobile && (
        <li>
          <LanguageToggle />
        </li>
      )}
      {DESKTOP_NAV_ITEMS.map((item) => (
        <li key={item.label} className={isMobile ? "w-full" : undefined}>
          <button
            onClick={(e) => {
              handleNavigation(item.href, item.requiresAuth, e);
              if (isMobile && closeMenu) closeMenu();
            }}
            type="button"
            aria-label={`Go to ${item.label} page`}
            className={`text-left w-full hover:text-white transition-colors ${
              isMobile ? "py-2" : ""
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
      <li className={isMobile ? "w-full" : undefined}>
        <button
          onClick={handleAuth}
          type="button"
          aria-label={isAuthenticated ? "Logout" : "Login"}
          className={`text-left w-full hover:text-white transition-colors ${
            isMobile ? "py-2" : ""
          }`}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </li>
    </>
  );
};

export default NavigationLinks;
