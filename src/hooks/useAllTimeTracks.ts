// /hooks/useAllTimeTracks.ts
import { FullRankingData, RankedTrack } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchAllTimeTracks = async (
  rankingData?: FullRankingData,
): Promise<RankedTrack[]> => {
  if (!rankingData) return [];

  return rankingData.allTimeTracksRanking.map((item) => ({
    ...item.track,
    count: item.count,
  }));
};

const useAllTimeTracks = (rankingData?: FullRankingData) => {
  return useQuery<RankedTrack[], Error>({
    queryKey: ["allTimeTracks"],
    queryFn: () => fetchAllTimeTracks(rankingData),
    enabled: !!rankingData,
  });
};

export default useAllTimeTracks;
