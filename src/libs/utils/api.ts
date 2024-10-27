import { UserFavorites } from "@/types/favorite";
import axios from "axios";

export const fetchUserFavorites = async (
  userId: number,
): Promise<UserFavorites> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(
    `${baseUrl}/api/user-favorites?userId=${userId}`,
  );
  const { allTimeArtists, allTimeTracks, currentArtists, currentTracks } =
    response.data;

  return {
    allTimeArtists: allTimeArtists ?? [],
    allTimeTracks: allTimeTracks ?? [],
    currentArtists: currentArtists ?? [],
    currentTracks: currentTracks ?? [],
  };
};

export const fetchUserData = async (
  userId: number,
): Promise<{ name: string; profileImage: string | null }> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(`${baseUrl}/api/users?userId=${userId}`);
  const { name, profileImage } = response.data;
  return { name, profileImage };
};
