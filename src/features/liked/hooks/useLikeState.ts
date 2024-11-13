import useLikeMutation from "@/features/liked/mutations/useLikeMutation";
import useUnlikeMutation from "@/features/liked/mutations/useUnlikeMutation";
import useCheckLiked from "@/features/liked/queries/useCheckLiked";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

interface LikeButtonProps {
  itemType: "artist" | "track" | "album";
  itemId: string;
  name: string;
  imageUrl: string;
  artists?: string;
  followers?: number;
  popularity?: number;
  releaseDate?: string;
}

const useLikeState = (
  itemType: "artist" | "track" | "album",
  itemId: string,
) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: liked = false } = useCheckLiked(userId, itemType, itemId);
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  const toggleLike = useCallback(
    (itemData: Omit<LikeButtonProps, "itemType" | "itemId">) => {
      if (!userId) return;

      if (liked) {
        unlikeMutation.mutate({ userId, itemType, itemId });
      } else {
        likeMutation.mutate({
          userId,
          itemType,
          itemId,
          ...itemData,
        });
      }
    },
    [liked, userId, itemType, itemId, likeMutation, unlikeMutation],
  );

  return {
    liked,
    toggleLike,
  };
};

export default useLikeState;
