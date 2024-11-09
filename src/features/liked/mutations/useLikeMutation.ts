import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LikeItemPayload {
  userId: string;
  itemType: "artist" | "track" | "album";
  itemId: string;
  name: string;
  imageUrl: string;
  artists?: string;
  followers?: number;
  previewUrl?: string | null;
  durationMs?: number;
  popularity?: number;
  releaseDate?: string;
}

interface MutationContext {
  previousLiked?: boolean;
}

const useLikeMutation = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation<
    void,
    Error,
    LikeItemPayload,
    MutationContext
  >({
    mutationFn: (payload: LikeItemPayload) =>
      axios.post("/api/likes", {
        userId: payload.userId,
        itemType: payload.itemType,
        itemId: payload.itemId,
        name: payload.name,
        imageUrl: payload.imageUrl,
        artists: payload.artists,
        followers: payload.followers,
        previewUrl: payload.previewUrl,
        durationMs: payload.durationMs,
        popularity: payload.popularity,
        releaseDate: payload.releaseDate,
      }),

    onMutate: async (payload: LikeItemPayload) => {
      await queryClient.cancelQueries({
        queryKey: ["likes", payload.userId, payload.itemType, payload.itemId],
      });

      const previousLiked = queryClient.getQueryData<boolean>([
        "likes",
        payload.userId,
        payload.itemType,
        payload.itemId,
      ]);

      queryClient.setQueryData<boolean>(
        ["likes", payload.userId, payload.itemType, payload.itemId],
        true,
      );

      return { previousLiked };
    },
    onError: (
      error: Error,
      variables: LikeItemPayload,
      context?: MutationContext,
    ) => {
      if (context?.previousLiked !== undefined) {
        queryClient.setQueryData<boolean>(
          ["likes", variables.userId, variables.itemType, variables.itemId],
          context.previousLiked,
        );
      }
    },
    onSettled: (data, error, variables: LikeItemPayload) => {
      queryClient.invalidateQueries({
        queryKey: [
          "likes",
          variables.userId,
          variables.itemType,
          variables.itemId,
        ],
      });
    },
  });

  return likeMutation;
};

export default useLikeMutation;
