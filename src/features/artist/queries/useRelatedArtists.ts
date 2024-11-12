import { SpotifyRelatedArtists } from "@/types/artist";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseRelatedArtistsProps {
  artistId: string;
  enabled?: boolean;
}

const fetchRelatedArtists = async (
  artistId: string,
): Promise<SpotifyRelatedArtists> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<SpotifyRelatedArtists>(
    `${baseUrl}/api/artist/${artistId}/related`,
  );
  return response.data;
};

const useRelatedArtists = ({
  artistId,
  enabled = true,
}: UseRelatedArtistsProps) => {
  return useQuery({
    queryKey: ["related-artists", artistId],
    queryFn: () => fetchRelatedArtists(artistId),
    enabled,
  });
};

export default useRelatedArtists;
