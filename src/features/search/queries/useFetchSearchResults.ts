import { SearchResponseData } from "@/types/search";
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";

type SearchQueryKey = readonly ["search", string, string];

const fetchSearchResults = async ({
  pageParam = 0,
  queryKey,
}: QueryFunctionContext<SearchQueryKey>): Promise<SearchResponseData> => {
  const [, searchQuery, currentType] = queryKey;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<SearchResponseData>(
    `${baseUrl}/api/advanced-search`,
    {
      params: {
        q: searchQuery.trim(),
        type: currentType,
        limit: 10,
        offset: pageParam,
      },
    },
  );
  return response.data;
};

const useFetchSearchResults = (searchQuery: string, currentType: string) => {
  const queryKey: SearchQueryKey = [
    "search",
    searchQuery,
    currentType,
  ] as const;

  return useInfiniteQuery<
    SearchResponseData,
    Error,
    InfiniteData<SearchResponseData>,
    SearchQueryKey
  >({
    queryKey,
    queryFn: fetchSearchResults,
    enabled: searchQuery.trim().length > 0, // 검색어가 있을 때만 활성화
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
      if (currentType === "all") {
        const lastArtistPage = lastPage.artists;
        const lastTrackPage = lastPage.tracks;
        const lastAlbumPage = lastPage.albums;

        const nextArtistOffset = lastArtistPage?.next
          ? lastArtistPage.offset + lastArtistPage.limit
          : undefined;
        const nextTrackOffset = lastTrackPage?.next
          ? lastTrackPage.offset + lastTrackPage.limit
          : undefined;
        const nextAlbumOffset = lastAlbumPage?.next
          ? lastAlbumPage.offset + lastAlbumPage.limit
          : undefined;

        // 모든 카테고리에 대해 다음 페이지가 있는지 확인
        if (nextArtistOffset || nextTrackOffset || nextAlbumOffset) {
          // 우선 아티스트, 트랙, 앨범 중 가장 먼저 페칭할 수 있는 카테고리를 반환
          if (nextArtistOffset) return nextArtistOffset;
          if (nextTrackOffset) return nextTrackOffset;
          if (nextAlbumOffset) return nextAlbumOffset;
        }
      }
      return undefined;
    },
  });
};

export default useFetchSearchResults;
