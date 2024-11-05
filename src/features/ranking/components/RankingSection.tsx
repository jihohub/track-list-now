import ErrorComponent from "@/features/common/components/ErrorComponent";
import TItem from "@/features/common/components/TItem";
import { isArtistWithRanking, TItemData } from "@/types/ranking";
import { useTranslation } from "next-i18next";

interface RankingSectionProps {
  sectionType: "artist" | "track";
  sectionData: TItemData[];
  isLoading: boolean;
  error: Error | null;
}

const RankingSection = ({
  sectionType,
  sectionData,
  isLoading,
  error,
}: RankingSectionProps) => {
  const { t } = useTranslation(["common", "ranking"]);

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-400 text-center mt-4">{t("loading")}</p>
      </div>
    );
  }

  if (sectionData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {sectionData.map((item, index) => {
        if (sectionType === "artist" && isArtistWithRanking(item)) {
          return (
            <TItem
              key={item.artist.artistId}
              index={index}
              item={item}
              type="artist"
            />
          );
        }
        if (sectionType === "track" && !isArtistWithRanking(item)) {
          return (
            <TItem
              key={item.track.trackId}
              index={index}
              item={item}
              type="track"
            />
          );
        }
        return null;
      })}
    </ul>
  );
};

export default RankingSection;
