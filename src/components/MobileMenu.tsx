import CloseIcon from "@/assets/icons/close.svg";
import Link from "next/link";
import { useEffect, useRef } from "react";
import NavigationLinks from "./NavigationLinks";

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

const MobileMenu = ({ isMenuOpen, closeMenu }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed top-0 right-0 w-full bg-zinc-900 text-vividSkyBlue transform transition-all duration-300 ease-in-out z-50 opacity-100 scale-100"
    >
      <div className="flex justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Track List Now
        </Link>
        <button
          onClick={closeMenu}
          type="button"
          aria-label="Close menu"
          className="focus:outline-none"
        >
          <CloseIcon />
        </button>
      </div>
      <ul className="flex flex-col space-y-4 p-4">
        <NavigationLinks isMobile closeMenu={closeMenu} />
      </ul>
    </div>
  );
};

export default MobileMenu;
