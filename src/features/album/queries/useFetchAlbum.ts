import { AlbumResponseData, SimplifiedAlbum } from "@/types/album";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAlbum = async (albumId: string): Promise<SimplifiedAlbum> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<AlbumResponseData>(
    `${baseUrl}/api/album/${albumId}`,
  );
  return response.data as SimplifiedAlbum;
};

const useFetchAlbum = (albumId: string) => {
  return useQuery<SimplifiedAlbum, Error>({
    queryKey: ["album", albumId],
    queryFn: () => fetchAlbum(albumId),
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchAlbum;
