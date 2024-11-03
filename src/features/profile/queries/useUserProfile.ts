import { UserFavorites } from "@/types/favorite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UserData {
  name: string;
  profileImage: string | null;
}

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

const useUserProfile = (userId: number) => {
  const queryClient = useQueryClient();

  const {
    data: userFavorites,
    error: userFavoritesError,
    isLoading: isFavoritesLoading,
  } = useQuery<UserFavorites, Error>({
    queryKey: ["userFavorites", userId],
    queryFn: () => fetchUserFavorites(userId),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: userData,
    error: userDataError,
    isLoading: isUserDataLoading,
  } = useQuery<UserData, Error>({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserData(userId),
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation<UserFavorites, Error, UserFavorites, unknown>({
    mutationFn: async (newFavorites: UserFavorites) => {
      const response = await axios.patch<UserFavorites>("/api/user-favorites", {
        userId,
        ...newFavorites,
      });
      return response.data;
    },
    onMutate: async (newFavorites) => {
      await queryClient.cancelQueries({ queryKey: ["userFavorites", userId] });

      const previousFavorites = queryClient.getQueryData<UserFavorites>([
        "userFavorites",
        userId,
      ]);

      queryClient.setQueryData(["userFavorites", userId], newFavorites);

      return { previousFavorites };
    },
    onError: (error: unknown) => {
      JSON.stringify(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userFavorites", userId] });
    },
  });

  return {
    userFavorites,
    userFavoritesError,
    isFavoritesLoading,
    userData,
    userDataError,
    isUserDataLoading,
    saveFavorites: mutation.mutate,
  };
};

export default useUserProfile;
