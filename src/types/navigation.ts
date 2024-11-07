import { FC, SVGProps } from "react";

export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export interface NavigationProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

export interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}
