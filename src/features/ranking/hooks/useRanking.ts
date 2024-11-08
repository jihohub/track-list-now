import useFetchRanking from "@/features/ranking/queries/useFetchRanking";
import {
  RankingCategory,
  TItemData,
  isArtistWithRanking,
  isTrackWithRanking,
} from "@/types/ranking";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useRanking = (category: RankingCategory) => {
  const { t } = useTranslation(["common", "ranking"]);
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useFetchRanking(category);

  const handleCategoryChange = (newCategory: string) => {
    router.push(`/ranking/${newCategory.toLowerCase()}`);
  };

  const title = (() => {
    const titleMap: Record<RankingCategory, string> = {
      ALL_TIME_ARTIST: "all_time_favorite_artists",
      ALL_TIME_TRACK: "all_time_favorite_tracks",
      CURRENT_ARTIST: "current_favorite_artists",
      CURRENT_TRACK: "current_favorite_tracks",
    };
    return titleMap[category] || "Ranking";
  })();

  const getRankingData = () => {
    const items = data?.pages.flatMap((page) => page.items) ?? [];

    const typeConfig = {
      sectionType: "artist" as const,
      sectionData: [] as TItemData[],
    };

    switch (category) {
      case "ALL_TIME_ARTIST":
      case "CURRENT_ARTIST":
        return {
          sectionType: "artist" as const,
          sectionData: items.filter(isArtistWithRanking),
        };
      case "ALL_TIME_TRACK":
      case "CURRENT_TRACK":
        return {
          sectionType: "track" as const,
          sectionData: items.filter(isTrackWithRanking),
        };
      default:
        return typeConfig;
    }
  };

  const { sectionType, sectionData } = getRankingData();
  const pageTitle = t(title);
  const pageDescription = `Top ${
    sectionType === "artist" ? "Artists" : "Tracks"
  } ranking for ${pageTitle.replace("_", " ")} on Track List Now`;

  return {
    pageTitle,
    pageDescription,
    sectionType,
    sectionData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    handleCategoryChange,
  };
};

export default useRanking;
