// /hooks/useRankingData.ts
import { FullRankingData, RankedArtist, RankedTrack } from "@/types/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type RankingType =
  | "allTimeArtists"
  | "currentArtists"
  | "allTimeTracks"
  | "currentTracks";

const useRankingData = (
  rankingData: FullRankingData | undefined,
  type: RankingType,
): UseQueryResult<RankedArtist[] | RankedTrack[], Error> => {
  return useQuery<RankedArtist[] | RankedTrack[], Error>({
    queryKey: [type],
    queryFn: () => {
      if (!rankingData) return Promise.resolve([]);
      switch (type) {
        case "allTimeArtists":
          return Promise.resolve(
            rankingData.allTimeArtistsRanking.map(
              (item) =>
                ({
                  ...item.artist,
                  count: item.count,
                }) as RankedArtist,
            ),
          );
        case "currentArtists":
          return Promise.resolve(
            rankingData.currentArtistsRanking.map(
              (item) =>
                ({
                  ...item.artist,
                  count: item.count,
                }) as RankedArtist,
            ),
          );
        case "allTimeTracks":
          return Promise.resolve(
            rankingData.allTimeTracksRanking.map(
              (item) =>
                ({
                  ...item.track,
                  count: item.count,
                }) as RankedTrack,
            ),
          );
        case "currentTracks":
          return Promise.resolve(
            rankingData.currentTracksRanking.map(
              (item) =>
                ({
                  ...item.track,
                  count: item.count,
                }) as RankedTrack,
            ),
          );
        default:
          return Promise.resolve([]);
      }
    },
    enabled: !!rankingData,
    staleTime: 5 * 60 * 1000,
  });
};

export default useRankingData;
