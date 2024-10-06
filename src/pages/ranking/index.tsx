import RankingItem from "@/components/RankingItem";
import spotifyApi from "@/lib/axios";
import { Artist, RankingItemType, Track } from "@/types/types";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RankingPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { category } = router.query;
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<RankingItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSpotifyDataBatch = async (
    type: "artists" | "tracks",
    ids: string[],
  ): Promise<Artist[] | Track[]> => {
    if (ids.length === 0) {
      return [];
    }

    try {
      if (ids.length === 1) {
        const result = await spotifyApi.get(`/${type}/${ids[0]}`);
        return [result.data];
      }
      const result = await spotifyApi.get(`/${type}`, {
        params: { ids: ids.join(",") },
      });
      return result.data[type === "tracks" ? "tracks" : "artists"];
    } catch (error) {
      console.error("Spotify 데이터 요청 중 오류:", error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ranking?category=${category}`);
      const rankingData: RankingItemType[] = await response.json();

      const isTrack = category === "atfTracks" || category === "cfTracks";
      const ids = rankingData.map((item) =>
        isTrack ? item.trackId : item.artistId,
      );

      let spotifyData: (Artist | Track)[] = [];

      if (ids.length === 1) {
        const singleData = await fetchSpotifyDataBatch(
          isTrack ? "tracks" : "artists",
          ids,
        );
        spotifyData = singleData;
      } else {
        const batchSize = 50;
        for (let i = 0; i < ids.length; i += batchSize) {
          const batchIds = ids.slice(i, i + batchSize);
          const batchData = await fetchSpotifyDataBatch(
            isTrack ? "tracks" : "artists",
            batchIds,
          );
          spotifyData = [...spotifyData, ...batchData];
        }
      }

      const updatedData = rankingData.map((item, index) => {
        const spotifyItem = spotifyData.find((data) =>
          isTrack ? data?.id === item.trackId : data?.id === item.artistId,
        );

        return {
          name: spotifyItem?.name || "Unknown",
          imageUrl:
            (isTrack
              ? spotifyItem?.album?.images?.[0]?.url
              : spotifyItem?.images?.[0]?.url) || "/default-image.jpg",
          followers: spotifyItem?.followers?.total || 0,
          popularity: isTrack ? spotifyItem?.popularity || 0 : 0,
          artists: isTrack
            ? spotifyItem?.artists.map((artist) => artist.name).join(", ")
            : null,
          count: item.count,
        };
      });

      setData(updatedData);
    } catch (error) {
      console.error("랭킹 데이터 가져오기 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      switch (category) {
        case "atfArtists":
          setTitle("all_time_favorite_artists");
          break;
        case "atfTracks":
          setTitle("all_time_favorite_tracks");
          break;
        case "cfArtists":
          setTitle("current_favorite_artists");
          break;
        case "cfTracks":
          setTitle("current_favorite_tracks");
          break;
        default:
          setTitle("Ranking");
          break;
      }
      fetchData();
    }
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-white mb-6">{t(title)}</h1>
      {data.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
      ) : (
        <ul className="space-y-4">
          {data.map((item, index) => (
            <RankingItem
              key={index}
              index={index}
              item={item}
              type={title.includes("tracks") ? "track" : "artist"}
              category={
                Array.isArray(category) ? category[0] : (category ?? "")
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RankingPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "ko", ["common"])),
  },
});
