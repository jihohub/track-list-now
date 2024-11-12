import { useRouter } from "next/router";
import { useEffect } from "react";

type TabType = "top_tracks" | "albums" | "related_artists";

interface UseArtistTabsProps {
  defaultTab?: TabType;
}

const useArtistTabs = ({
  defaultTab = "top_tracks",
}: UseArtistTabsProps = {}) => {
  const router = useRouter();

  // 라우터가 준비되었을 때 초기 탭 설정
  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.tab) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: defaultTab },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [router.isReady, defaultTab]);

  // 현재 활성화된 탭
  const currentTab = (router.query.tab as TabType) || defaultTab;

  // 탭 변경 핸들러
  const handleTabChange = (newTab: TabType) => {
    const query = { ...router.query, tab: newTab };
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  return {
    currentTab,
    handleTabChange,
    isReady: router.isReady,
  };
};

export default useArtistTabs;
