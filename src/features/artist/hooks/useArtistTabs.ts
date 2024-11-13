import { useRouter } from "next/router";
import { useState } from "react";

const useArtistTabs = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [currentTab, setCurrentTab] = useState<string>(
    typeof tab === "string" ? tab : "top_tracks",
  );

  return {
    currentTab,
    setCurrentTab,
  };
};

export default useArtistTabs;
