import { SearchResponseData } from "@/types/search";
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";

type LikedQueryKey = readonly ["likes", string, string];

const fetchLikedItems = async ({
  pageParam = 0,
  queryKey,
}: QueryFunctionContext<LikedQueryKey>): Promise<SearchResponseData> => {
  const [, userId, currentType] = queryKey;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<SearchResponseData>(`${baseUrl}/api/likes`, {
    params: {
      userId,
      type: currentType,
      limit: currentType === "all" ? 5 : 10,
      offset: pageParam,
    },
  });
  return response.data;
};

const useFetchLikedItems = (
  userId: string | undefined,
  currentType: string,
) => {
  const queryKey: LikedQueryKey = ["likes", userId ?? "", currentType] as const;

  return useInfiniteQuery<
    SearchResponseData,
    Error,
    InfiniteData<SearchResponseData>,
    LikedQueryKey
  >({
    queryKey,
    queryFn: fetchLikedItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (currentType === "artist" && lastPage.artists?.next) {
        return lastPage.artists.offset + lastPage.artists.limit;
      }
      if (currentType === "track" && lastPage.tracks?.next) {
        return lastPage.tracks.offset + lastPage.tracks.limit;
      }
      if (currentType === "album" && lastPage.albums?.next) {
        return lastPage.albums.offset + lastPage.albums.limit;
      }
      return undefined;
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  });
};

export default useFetchLikedItems;
