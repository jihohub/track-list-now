import { ArtistPageData } from "@/types/artist";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchArtistData = async (
  artistId: string,
): Promise<ArtistPageData> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<ArtistPageData>(
    `${baseUrl}/api/artist/${artistId}`,
  );
  return response.data;
};

const useFetchArtist = (artistId: string) => {
  return useQuery<ArtistPageData, Error>({
    queryKey: ["artist", artistId],
    queryFn: () => fetchArtistData(artistId),
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchArtist;
