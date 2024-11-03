import HeartIcon from "@/assets/icons/heart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import RankingIcon from "@/assets/icons/ranking.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MobileNav = () => {
  const router = useRouter();
  const { locale } = router;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const handleNavigation =
    (href: string, requiresAuth: boolean) => async (e: React.MouseEvent) => {
      if (requiresAuth && !isAuthenticated) {
        e.preventDefault();
        await signIn();
      }
      if (locale === "en") {
        router.push(`/${locale}${href}`);
      }
      router.push(href);
    };

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon />,
      requiresAuth: false,
    },
    {
      name: "Search",
      href: "/search",
      icon: <SearchIcon />,
      requiresAuth: false,
    },
    {
      name: "Ranking",
      href: "/ranking",
      icon: <RankingIcon />,
      requiresAuth: false,
    },
    {
      name: "Liked",
      href: "/liked",
      icon: <HeartIcon />,
      requiresAuth: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <ProfileIcon />,
      requiresAuth: true,
    },
  ];

  if (isLoading) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-vividSkyBlue md:hidden">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.name}>
            <button
              className="flex flex-col items-center"
              onClick={handleNavigation(item.href, item.requiresAuth)}
              type="button"
              aria-label={item.name}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
