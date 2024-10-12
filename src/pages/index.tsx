// /pages/index.tsx
import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import RankingSection from "@/features/main/RankingSection";
import useRankingData from "@/hooks/useRankingData";
import {
  FullRankingData,
  RankedArtist,
  RankedTrack,
  RankingSectionProps,
} from "@/types/types";
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
      const { artistRanking, trackRanking, artist, track } = rankingData;

      // 아티스트 및 트랙 정보를 맵으로 생성
      const artistMap = new Map<string, any>();
      artist.forEach((a) => artistMap.set(a.id, a));

      const trackMap = new Map<string, any>();
      track.forEach((t) => trackMap.set(t.id, t));

      // 랭킹 타입별로 분리
      const allTimeArtistsRanking = artistRanking.filter(
        (ar) => ar.rankingType === "ALL_TIME",
      );
      const currentArtistsRanking = artistRanking.filter(
        (ar) => ar.rankingType === "CURRENT",
      );

      const allTimeTracksRanking = trackRanking.filter(
        (tr) => tr.rankingType === "ALL_TIME",
      );
      const currentTracksRanking = trackRanking.filter(
        (tr) => tr.rankingType === "CURRENT",
      );

      // RankedArtist 및 RankedTrack 배열 생성
      const allTimeArtists: RankedArtist[] = allTimeArtistsRanking.map(
        (item) => {
          const artistData = artistMap.get(item.artistId);
          if (!artistData)
            throw new Error(`Artist not found: ${item.artistId}`);
          return {
            id: artistData.id,
            name: artistData.name,
            imageUrl: artistData.imageUrl,
            followers: artistData.followers,
            count: item.count,
          } as RankedArtist;
        },
      );

      const currentArtists: RankedArtist[] = currentArtistsRanking.map(
        (item) => {
          const artistData = artistMap.get(item.artistId);
          if (!artistData)
            throw new Error(`Artist not found: ${item.artistId}`);
          return {
            id: artistData.id,
            name: artistData.name,
            imageUrl: artistData.imageUrl,
            followers: artistData.followers,
            count: item.count,
          } as RankedArtist;
        },
      );

      const allTimeTracks: RankedTrack[] = allTimeTracksRanking.map((item) => {
        const trackData = trackMap.get(item.trackId);
        if (!trackData) throw new Error(`Track not found: ${item.trackId}`);
        return {
          id: trackData.id,
          name: trackData.name,
          albumImageUrl: trackData.albumImageUrl,
          artistNames: trackData.artistNames,
          popularity: trackData.popularity,
          count: item.count,
        } as RankedTrack;
      });

      const currentTracks: RankedTrack[] = currentTracksRanking.map((item) => {
        const trackData = trackMap.get(item.trackId);
        if (!trackData) throw new Error(`Track not found: ${item.trackId}`);
        return {
          id: trackData.id,
          name: trackData.name,
          albumImageUrl: trackData.albumImageUrl,
          artistNames: trackData.artistNames,
          popularity: trackData.popularity,
          count: item.count,
        } as RankedTrack;
      });

      // React Query에 데이터 설정
      queryClient.setQueryData(["allTimeArtists"], allTimeArtists);
      queryClient.setQueryData(["allTimeTracks"], allTimeTracks);
      queryClient.setQueryData(["currentArtists"], currentArtists);
      queryClient.setQueryData(["currentTracks"], currentTracks);
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
