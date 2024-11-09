import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

const useNavigation = () => {
  const router = useRouter();
  const { locale, defaultLocale } = router;
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleNavigation = useCallback(
    async (href: string, requiresAuth?: boolean, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (requiresAuth && !isAuthenticated) {
        await signIn();
        return;
      }

      // locale이 기본 locale이 아닐 경우에만 locale path 추가
      const localizedHref =
        locale && locale !== defaultLocale ? `/${locale}${href}` : href;

      await router.push(localizedHref);
    },
    [router, locale, defaultLocale, isAuthenticated],
  );

  return {
    handleNavigation,
    locale,
    isAuthenticated,
    isLoading: status === "loading",
  };
};

export default useNavigation;
