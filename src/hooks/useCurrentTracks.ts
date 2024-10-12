// /hooks/useAllTimeTracks.ts
import { FullRankingData, RankedTrack } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchCurrentTracks = async (
  rankingData?: FullRankingData,
): Promise<RankedTrack[]> => {
  if (!rankingData) return [];

  return rankingData.currentTracksRanking.map((item) => ({
    ...item.track,
    count: item.count,
  }));
};

const useCurrentTracks = (rankingData?: FullRankingData) => {
  return useQuery<RankedTrack[], Error>({
    queryKey: ["currentTracks"],
    queryFn: () => fetchCurrentTracks(rankingData),
    enabled: !!rankingData,
  });
};

export default useCurrentTracks;
