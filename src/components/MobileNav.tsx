import { MOBILE_NAV_ITEMS } from "@/constants/navigation";
import useNavigation from "@/hooks/useNavigation";

const MobileNav = () => {
  const { handleNavigation, isLoading } = useNavigation();

  if (isLoading) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-vividSkyBlue md:hidden">
      <ul className="flex justify-around items-center h-16">
        {MOBILE_NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <button
              className="flex flex-col items-center"
              onClick={(e) => handleNavigation(item.href, item.requiresAuth, e)}
              type="button"
              aria-label={item.label}
            >
              {item.icon && <item.icon className="w-6 h-6" />}
              <span className="text-xs">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
