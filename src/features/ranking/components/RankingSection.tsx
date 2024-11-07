import ErrorComponent from "@/features/common/components/ErrorComponent";
import GlobalLoadingBar from "@/features/common/components/GlobalLoadingBar";
import LoadingBar from "@/features/common/components/LoadingBar";
import TItem from "@/features/common/components/TItem";
import { isArtistWithRanking, TItemData } from "@/types/ranking";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

interface RankingSectionProps {
  sectionType: "artist" | "track";
  sectionData: TItemData[];
  isLoading: boolean;
  error: Error | null;
  fetchMore: () => void;
  hasMore: boolean;
}

const RankingSection = ({
  sectionType,
  sectionData,
  isLoading,
  error,
  fetchMore,
  hasMore,
}: RankingSectionProps) => {
  const { t } = useTranslation(["common", "ranking"]);

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (isLoading) {
    return <LoadingBar />;
  }

  if (sectionData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={sectionData.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<GlobalLoadingBar />}
    >
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
    </InfiniteScroll>
  );
};

export default RankingSection;
