import LanguageToggle from "@/features/common/components/LanguageToggle";
import NavigationLinks from "./NavigationLinks";

const DesktopNav = () => {
  return (
    <ul className="hidden md:flex items-center space-x-4">
      <li>
        <LanguageToggle />
      </li>
      <NavigationLinks />
    </ul>
  );
};

export default DesktopNav;
