import HeartIcon from "@/assets/icons/heart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import RankingIcon from "@/assets/icons/ranking.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { NavItem } from "@/types/navigation";
import { FC, SVGProps } from "react";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

interface NavItemWithIcon extends NavItem {
  icon?: IconComponent;
}

export const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: "Search", href: "/search" },
  { label: "Ranking", href: "/ranking" },
  { label: "Liked", href: "/liked", requiresAuth: true },
  { label: "Profile", href: "/profile", requiresAuth: true },
];

export const MOBILE_NAV_ITEMS: NavItemWithIcon[] = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Search",
    href: "/search",
    icon: SearchIcon,
  },
  {
    label: "Ranking",
    href: "/ranking",
    icon: RankingIcon,
  },
  {
    label: "Liked",
    href: "/liked",
    icon: HeartIcon,
    requiresAuth: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: ProfileIcon,
    requiresAuth: true,
  },
];
