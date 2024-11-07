import rankingSectionsConstants, {
  RankingSectionConstant,
} from "@/constants/rankingSections";
import {
  FeaturedRankingData,
  getRankingDataByCategory,
  RankingSectionProps,
} from "@/types/ranking";
import { useTranslation } from "next-i18next";

const useRankingSections = (rankingData: FeaturedRankingData | undefined) => {
  const { t } = useTranslation(["common", "main"]);

  return rankingSectionsConstants.map(
    (section: RankingSectionConstant): RankingSectionProps => {
      const data = rankingData
        ? getRankingDataByCategory(rankingData, section.category)
        : [];

      return {
        title: t(section.titleKey),
        data,
        type: section.type,
        category: section.category,
      };
    },
  );
};

export default useRankingSections;
