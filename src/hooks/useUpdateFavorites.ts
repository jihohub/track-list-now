// /hooks/useUpdateFavorites.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useUpdateFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFavorites: UpdateFavorites) => {
      const response = await axios.patch("/api/userFavorites", newFavorites);
      return response.data;
    },
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(["userFavorites"]);
      queryClient.invalidateQueries(["featuredRanking"]);
    },
    onError: (error: any) => {
      console.error("Failed to update favorites:", error);
    },
  });
};

export default useUpdateFavorites;
