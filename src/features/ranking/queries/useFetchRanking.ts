import { TItemData } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchRankingData = async (
  category: string,
): Promise<TItemData[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<TItemData[]>(
    `${baseUrl}/api/ranking?category=${category}`,
  );
  return response.data;
};

const useFetchRanking = (category: string) => {
  return useQuery<TItemData[], Error>({
    queryKey: ["ranking", category],
    queryFn: () => fetchRankingData(category),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export default useFetchRanking;
