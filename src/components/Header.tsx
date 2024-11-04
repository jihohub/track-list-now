import CloseIcon from "@/assets/icons/close.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import Image from "next/image";
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
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <Image src="/logo.png" alt="logo image" width={120} height={28} />
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
            <MobileMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
