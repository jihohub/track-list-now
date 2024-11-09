import { TItemData } from "@/types/ranking";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RankingResponse {
  items: TItemData[];
  offset: number;
  limit: number;
  total: number;
  next: string | null;
}

type RankingQueryKey = readonly ["ranking", string];

export const fetchRankingData = async (
  pageParam: number,
  category: string,
): Promise<RankingResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<RankingResponse>(`${baseUrl}/api/ranking`, {
    params: {
      category,
      offset: pageParam,
      limit: 10,
    },
  });
  return response.data;
};

const useFetchRanking = (category: string) => {
  return useInfiniteQuery<
    RankingResponse,
    Error,
    InfiniteData<RankingResponse>,
    RankingQueryKey,
    number
  >({
    queryKey: ["ranking", category],
    queryFn: ({ pageParam = 0 }) => fetchRankingData(pageParam, category),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + lastPage.limit : undefined,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchRanking;
