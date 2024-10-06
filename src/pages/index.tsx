import RankingSection from "@/components/RankingSection";
import spotifyApi from "@/lib/axios";
import { Artist, RankingSectionProps, Track } from "@/types/types";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";

const MainPage = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);
  const [allTimeArtists, setAllTimeArtists] = useState<Artist[]>([]);
  const [allTimeTracks, setAllTimeTracks] = useState<Track[]>([]);
  const [currentArtists, setCurrentArtists] = useState<Artist[]>([]);
  const [currentTracks, setCurrentTracks] = useState<Track[]>([]);

  const sections: RankingSectionProps[] = [
    {
      title: t("all_time_favorite_artists"),
      data: allTimeArtists,
      type: "artist",
      category: "atfArtists",
    },
    {
      title: t("all_time_favorite_tracks"),
      data: allTimeTracks,
      type: "track",
      category: "atfTracks",
    },
    {
      title: t("current_favorite_artists"),
      data: currentArtists,
      type: "artist",
      category: "cfArtists",
    },
    {
      title: t("current_favorite_tracks"),
      data: currentTracks,
      type: "track",
      category: "cfTracks",
    },
  ];

  const fetchSpotifyDataBatch = async (
    type: "artists" | "tracks",
    ids: string[],
  ): Promise<Artist[] | Track[]> => {
    if (ids.length === 0) return [];

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
      console.error("Error fetching Spotify data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await axios.get("/api/featured-ranking");
        const {
          allTimeArtistsRanking,
          allTimeTracksRanking,
          currentArtistsRanking,
          currentTracksRanking,
        } = response.data;

        const atfArtistIds = allTimeArtistsRanking.map(
          (item: any) => item.artistId,
        );
        const atfArtistsData = await fetchSpotifyDataBatch(
          "artists",
          atfArtistIds,
        );
        const allTimeArtistsWithCounts = atfArtistsData.map(
          (artist: any, index: number) => ({
            ...artist,
            count: allTimeArtistsRanking[index].count,
          }),
        );
        setAllTimeArtists(allTimeArtistsWithCounts);

        const atfTrackIds = allTimeTracksRanking.map(
          (item: any) => item.trackId,
        );
        const atfTracksData = await fetchSpotifyDataBatch(
          "tracks",
          atfTrackIds,
        );
        const allTimeTracksWithCounts = atfTracksData.map(
          (track: any, index: number) => ({
            ...track,
            count: allTimeTracksRanking[index].count,
          }),
        );
        setAllTimeTracks(allTimeTracksWithCounts);

        const cfArtistIds = currentArtistsRanking.map(
          (item: any) => item.artistId,
        );
        const cfArtistsData = await fetchSpotifyDataBatch(
          "artists",
          cfArtistIds,
        );
        const currentArtistsWithCounts = cfArtistsData.map(
          (artist: any, index: number) => ({
            ...artist,
            count: currentArtistsRanking[index].count,
          }),
        );
        setCurrentArtists(currentArtistsWithCounts);

        const cfTrackIds = currentTracksRanking.map(
          (item: any) => item.trackId,
        );
        const cfTracksData = await fetchSpotifyDataBatch("tracks", cfTrackIds);
        const currentTracksWithCounts = cfTracksData.map(
          (track: any, index: number) => ({
            ...track,
            count: currentTracksRanking[index].count,
          }),
        );
        setCurrentTracks(currentTracksWithCounts);
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section, index) => (
        <RankingSection
          key={index}
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "ko", ["common"])),
  },
});
