import { ArtistAlbumsResponse } from "@/types/artist";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseArtistAlbumsProps {
  artistId: string;
  enabled?: boolean;
}

const fetchArtistAlbums = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number;
  queryKey: readonly ["artist-albums", string];
}): Promise<ArtistAlbumsResponse> => {
  const [, artistId] = queryKey;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await axios.get<ArtistAlbumsResponse>(
    `${baseUrl}/api/artist/${artistId}/albums`,
    {
      params: {
        limit: 20,
        offset: pageParam,
      },
    },
  );

  return response.data;
};

const useArtistAlbums = ({
  artistId,
  enabled = true,
}: UseArtistAlbumsProps) => {
  return useInfiniteQuery({
    queryKey: ["artist-albums", artistId] as const,
    queryFn: fetchArtistAlbums,
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.offset + lastPage.limit;
      }
      return undefined;
    },
  });
};

export default useArtistAlbums;
