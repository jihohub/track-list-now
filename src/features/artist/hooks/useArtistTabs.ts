import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

type TabType = "top_tracks" | "albums" | "related_artists";

interface UseArtistTabsProps {
  defaultTab?: TabType;
}

const useArtistTabs = ({
  defaultTab = "top_tracks",
}: UseArtistTabsProps = {}) => {
  const router = useRouter();
  const { isReady, pathname, query } = router;

  const setInitialTab = useCallback(() => {
    if (!query.tab) {
      router.push(
        {
          pathname,
          query: { ...query, tab: defaultTab },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [pathname, query, defaultTab, router]);

  // 라우터가 준비되었을 때 초기 탭 설정
  useEffect(() => {
    if (!isReady) return;
    setInitialTab();
  }, [isReady, setInitialTab]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback(
    (newTab: TabType) => {
      router.push(
        {
          pathname,
          query: { ...query, tab: newTab },
        },
        undefined,
        { shallow: true },
      );
    },
    [pathname, query, router],
  );

  const currentTab = (query.tab as TabType) || defaultTab;

  return {
    currentTab,
    handleTabChange,
    isReady: router.isReady,
  };
};

export default useArtistTabs;
