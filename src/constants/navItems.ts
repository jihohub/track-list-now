interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Search", href: "/search" },
  { label: "Ranking", href: "/ranking" },
  { label: "Liked", href: "/liked" },
  { label: "Profile", href: "/profile" },
];

export default navItems;
