import { FeaturedRankingData } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchFeaturedRanking = async (): Promise<FeaturedRankingData> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<FeaturedRankingData>(
    `${baseUrl}/api/featured-ranking`,
  );
  return response.data;
};

const useFetchFeaturedRanking = () => {
  return useQuery<FeaturedRankingData, Error>({
    queryKey: ["featuredRanking"],
    queryFn: fetchFeaturedRanking,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchFeaturedRanking;
