import CloseIcon from "@/assets/icons/close.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import Link from "next/link";
import { useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky bg-zinc-950 text-vividSkyBlue p-4 top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Track List Now
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <DesktopNav />
            <li className="md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                className="flex items-center focus:outline-none"
              >
                {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </li>
          </ul>
          <MobileMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
