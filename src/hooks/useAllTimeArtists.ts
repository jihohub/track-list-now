// /hooks/useAllTimeArtists.ts
import { FullRankingData, RankedArtist } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchAllTimeArtists = async (
  rankingData?: FullRankingData,
): Promise<RankedArtist[]> => {
  if (!rankingData) return [];

  return rankingData.allTimeArtistsRanking.map((item) => ({
    ...item.artist,
    count: item.count,
  }));
};

const useAllTimeArtists = (rankingData?: FullRankingData) => {
  return useQuery<RankedArtist[], Error>({
    queryKey: ["allTimeArtists"],
    queryFn: () => fetchAllTimeArtists(rankingData),
    enabled: !!rankingData,
  });
};

export default useAllTimeArtists;
