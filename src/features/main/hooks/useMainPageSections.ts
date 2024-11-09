import rankingSectionsConstants, {
  RankingSectionConstant,
} from "@/constants/rankingSections";
import { FeaturedRankingData, RankingSectionProps } from "@/types/ranking";
import { useTranslation } from "next-i18next";

const useMainPageSections = (rankingData: FeaturedRankingData | undefined) => {
  const { t } = useTranslation(["common", "main"]);

  return rankingSectionsConstants.map(
    (section: RankingSectionConstant): RankingSectionProps => {
      const getDataByCategory = () => {
        switch (section.category) {
          case "ALL_TIME_ARTIST":
            return rankingData?.allTimeArtistsRanking || [];
          case "ALL_TIME_TRACK":
            return rankingData?.allTimeTracksRanking || [];
          case "CURRENT_ARTIST":
            return rankingData?.currentArtistsRanking || [];
          case "CURRENT_TRACK":
            return rankingData?.currentTracksRanking || [];
          default:
            return [];
        }
      };

      return {
        title: t(section.titleKey),
        data: getDataByCategory(),
        type: section.type,
        category: section.category,
      };
    },
  );
};

export default useMainPageSections;
