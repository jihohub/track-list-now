// /hooks/useRanking.ts
import fetchSpotifyDataBatch from "@/services/fetchSpotifyDataBatch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface RankingItem {
  count: number;
}

interface RankingData<T extends RankingItem> {
  rankings: T[];
}

const useRanking = <T extends RankingItem, D>(
  queryKey: string,
  type: "artists" | "tracks",
  rankingData: RankingData<T> | undefined,
  getId: (item: T) => string,
): UseQueryResult<(D & { count: number })[], Error> => {
  return useQuery<(D & { count: number })[], Error>({
    queryKey: [queryKey],
    queryFn: async () => {
      const ids = rankingData?.rankings.map(getId) || [];
      const data = (await fetchSpotifyDataBatch(type, ids)) as D[];
      return data.map((item, index) => ({
        ...item,
        count: rankingData!.rankings[index].count,
      }));
    },
    enabled: !!rankingData,
    staleTime: 5 * 60 * 1000,
  });
};

export default useRanking;
