// /hooks/useAllTimeArtists.ts
import { FullRankingData, RankedArtist } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchCurrentArtists = async (
  rankingData?: FullRankingData,
): Promise<RankedArtist[]> => {
  if (!rankingData) return [];

  return rankingData.currentArtistsRanking.map((item) => ({
    ...item.artist,
    count: item.count,
  }));
};

const useCurrentArtists = (rankingData?: FullRankingData) => {
  return useQuery<RankedArtist[], Error>({
    queryKey: ["currentArtists"],
    queryFn: () => fetchCurrentArtists(rankingData),
    enabled: !!rankingData,
  });
};

export default useCurrentArtists;
