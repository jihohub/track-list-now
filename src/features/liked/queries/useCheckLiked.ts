import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CheckLikedResponse {
  liked: boolean;
}

const fetchCheckLiked = async (
  userId: string,
  itemType: "artist" | "track" | "album",
  itemId: string,
): Promise<boolean> => {
  const response = await axios.get<CheckLikedResponse>("/api/likes/check", {
    params: { userId, itemType, itemId },
  });
  return response.data.liked;
};

const useCheckLiked = (
  userId: string | undefined,
  itemType: "artist" | "track" | "album",
  itemId: string,
) => {
  return useQuery<boolean, Error>({
    queryKey: ["likes", userId, itemType, itemId],
    queryFn: () => fetchCheckLiked(userId!, itemType, itemId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export default useCheckLiked;
