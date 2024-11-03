import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

interface UnlikeItemPayload {
  userId: string;
  itemType: "artist" | "track" | "album";
  itemId: string;
}

interface MutationContext {
  previousLiked?: boolean;
}

const useUnlikeMutation = (): UseMutationResult<
  void,
  Error,
  UnlikeItemPayload,
  MutationContext
> => {
  const queryClient = useQueryClient();

  const unlikeMutation = useMutation<
    void,
    Error,
    UnlikeItemPayload,
    MutationContext
  >({
    mutationFn: async (payload: UnlikeItemPayload) => {
      await axios.delete("/api/likes", {
        data: {
          userId: payload.userId,
          itemType: payload.itemType,
          itemId: payload.itemId,
        },
      });
    },
    onMutate: async (payload: UnlikeItemPayload) => {
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
        false,
      );

      return { previousLiked };
    },
    onError: (
      error: Error,
      variables: UnlikeItemPayload,
      context?: MutationContext,
    ) => {
      if (context?.previousLiked !== undefined) {
        queryClient.setQueryData<boolean>(
          ["likes", variables.userId, variables.itemType, variables.itemId],
          context.previousLiked,
        );
      }
    },
    onSettled: (data, error, variables: UnlikeItemPayload) => {
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

  return unlikeMutation;
};

export default useUnlikeMutation;
