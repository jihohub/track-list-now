// /pages/index.tsx
import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import RankingSection from "@/features/main/RankingSection";
import useRankingData from "@/hooks/useRankingData";
import { FullRankingData, RankingSectionProps } from "@/types/types";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const fetchFeaturedRanking = async (): Promise<FullRankingData> => {
  const response = await axios.get(
    "http://localhost:3000/api/featured-ranking",
  ); // 절대 경로 사용
  return response.data;
};

const MainPage = () => {
  const { t } = useTranslation("common");

  const {
    data: rankingData,
    error,
    isLoading,
  } = useQuery<FullRankingData, Error>({
    queryKey: ["featuredRanking"],
    queryFn: fetchFeaturedRanking,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allTimeArtists, isLoading: isLoadingATFArtists } =
    useRankingData(rankingData, "allTimeArtists");
  const { data: allTimeTracks, isLoading: isLoadingATFTracks } = useRankingData(
    rankingData,
    "allTimeTracks",
  );
  const { data: currentArtists, isLoading: isLoadingCFArtists } =
    useRankingData(rankingData, "currentArtists");
  const { data: currentTracks, isLoading: isLoadingCFTracks } = useRankingData(
    rankingData,
    "currentTracks",
  );

  const isAllLoading =
    isLoading ||
    isLoadingATFArtists ||
    isLoadingATFTracks ||
    isLoadingCFArtists ||
    isLoadingCFTracks;

  if (isAllLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  const sections: RankingSectionProps[] = [
    {
      title: t("all_time_favorite_artists"),
      data: allTimeArtists,
      type: "artist",
      category: "allTimeArtists",
    },
    {
      title: t("all_time_favorite_tracks"),
      data: allTimeTracks,
      type: "track",
      category: "allTimeTracks",
    },
    {
      title: t("current_favorite_artists"),
      data: currentArtists,
      type: "artist",
      category: "currentArtists",
    },
    {
      title: t("current_favorite_tracks"),
      data: currentTracks,
      type: "track",
      category: "currentTracks",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section) => (
        <RankingSection
          key={section.category}
          title={section.title}
          data={section.data}
          type={section.type}
          category={section.category}
        />
      ))}
    </div>
  );
};

export default MainPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["featuredRanking"],
      queryFn: fetchFeaturedRanking,
    });

    const rankingData = queryClient.getQueryData<FullRankingData>([
      "featuredRanking",
    ]);

    if (rankingData) {
      const {
        allTimeArtistsRanking,
        allTimeTracksRanking,
        currentArtistsRanking,
        currentTracksRanking,
      } = rankingData;
      // React Query에 데이터 설정
      queryClient.setQueryData(["allTimeArtists"], allTimeArtistsRanking);
      queryClient.setQueryData(["allTimeTracks"], allTimeTracksRanking);
      queryClient.setQueryData(["currentArtists"], currentArtistsRanking);
      queryClient.setQueryData(["currentTracks"], currentTracksRanking);
    }

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "main"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "main"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
};
