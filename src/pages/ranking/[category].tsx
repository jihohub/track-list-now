// /pages/ranking/[category].tsx
import ErrorComponent from "@/components/ErrorComponent";
import LoadingBar from "@/components/LoadingBar";
import RankingItem from "@/components/RankingItem";
import { RankingItemType } from "@/types/types";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fetchRankingData = async (
  category: string,
): Promise<RankingItemType[]> => {
  const response = await axios.get(
    `http://localhost:3000/api/ranking?category=${category}`,
  );
  return response.data;
};

const RankingPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { category } = router.query;
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<RankingItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: rankingData,
    error,
    isLoading: queryLoading,
  } = useQuery<RankingItemType[], Error>({
    queryKey: ["ranking", category],
    queryFn: () => fetchRankingData(category as string),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5분
  });

  useEffect(() => {
    if (category) {
      switch (category) {
        case "allTimeArtists":
          setTitle("all_time_favorite_artists");
          break;
        case "allTimeTracks":
          setTitle("all_time_favorite_tracks");
          break;
        case "currentArtists":
          setTitle("current_favorite_artists");
          break;
        case "currentTracks":
          setTitle("current_favorite_tracks");
          break;
        default:
          setTitle("Ranking");
          break;
      }
    }
  }, [category]);

  useEffect(() => {
    const processData = async () => {
      if (rankingData) {
        // 카테고리에 따라 트랙인지 아티스트인지 결정
        const isTrack =
          category === "allTimeTracks" || category === "currentTracks";
        const updatedData = rankingData.map((item) => ({
          name: isTrack ? item.track.name : item.artist.name,
          imageUrl: isTrack ? item.track.albumImageUrl : item.artist.imageUrl,
          followers: isTrack ? 0 : item.artist.followers,
          popularity: isTrack ? item.track.popularity || 0 : 0,
          artists: isTrack ? item.track.artistNames : null, // artistNames 필드 활용
          count: item.count,
          trackId: isTrack ? item.trackId : undefined, // 트랙일 경우 trackId 포함
          artistId: isTrack ? undefined : item.artistId, // 아티스트일 경우 artistId 포함
        }));

        setData(updatedData);
        setIsLoading(false);
      }
    };

    processData();
    console.log(rankingData);
  }, [rankingData, category]);

  if (isLoading || queryLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (!rankingData || rankingData.length === 0) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  // 카테고리에 따라 단일 섹션만 렌더링
  let sectionType: "artist" | "track" = "artist";
  let sectionData: RankingItemType[] = [];

  switch (category) {
    case "allTimeArtists":
      sectionType = "artist";
      sectionData = data.filter((item) => item.artistId);
      break;
    case "allTimeTracks":
      sectionType = "track";
      sectionData = data.filter((item) => item.trackId);
      break;
    case "currentArtists":
      sectionType = "artist";
      sectionData = data.filter((item) => item.artistId);
      break;
    case "currentTracks":
      sectionType = "track";
      sectionData = data.filter((item) => item.trackId);
      break;
    default:
      sectionType = "artist";
      sectionData = data;
      break;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-white mb-6">{t(title)}</h1>
      {sectionData.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
      ) : (
        <ul className="space-y-4">
          {sectionData.map((item, index) => (
            <RankingItem
              key={item.id || item.trackId || item.artistId || index}
              index={index}
              item={item}
              type={sectionType}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RankingPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const queryClient = new QueryClient();
  const category = params?.category as string;

  try {
    // 서버 사이드에서 데이터 패칭
    await queryClient.prefetchQuery(["ranking", category], () =>
      fetchRankingData(category),
    );

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
};
