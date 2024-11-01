import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heartFill.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

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

const LikeButton = ({
  itemType,
  itemId,
  name,
  imageUrl,
  artists,
  followers,
  popularity,
  releaseDate,
}: LikeButtonProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const userId = session?.user.id;

  // 좋아요 여부 확인
  const { data: liked } = useQuery<boolean>({
    queryKey: ["likes", userId, itemType, itemId],
    queryFn: async () => {
      const response = await axios.get("/api/likes/check", {
        params: { userId, itemType, itemId },
      });
      return response.data.liked;
    },
  });

  // 좋아요 추가 뮤테이션
  const likeMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/likes", {
        userId,
        itemType,
        itemId,
        name,
        imageUrl,
        artists,
        followers,
        popularity,
        releaseDate,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["likes", userId, itemType, itemId],
      });
      const previousLiked = queryClient.getQueryData<boolean>([
        "likes",
        userId,
        itemType,
        itemId,
      ]);
      queryClient.setQueryData<boolean>(
        ["likes", userId, itemType, itemId],
        true,
      );

      return { previousLiked };
    },
    onError: (error: unknown) => {
      JSON.stringify(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes", userId, itemType, itemId],
      });
    },
  });

  // 좋아요 삭제 뮤테이션
  const unlikeMutation = useMutation({
    mutationFn: () =>
      axios.delete("/api/likes", { data: { userId, itemType, itemId } }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["likes", userId, itemType, itemId],
      });
      const previousLiked = queryClient.getQueryData<boolean>([
        "likes",
        userId,
        itemType,
        itemId,
      ]);
      queryClient.setQueryData<boolean>(
        ["likes", userId, itemType, itemId],
        false,
      );

      return { previousLiked };
    },
    onError: (error: unknown) => {
      JSON.stringify(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes", userId, itemType, itemId],
      });
    },
  });

  const handleClick = () => {
    if (liked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-vividSkyBlue"
      aria-pressed={liked}
      aria-label={liked ? "Unlike this item" : "Like this item"}
      type="button"
    >
      {liked ? <HeartFillIcon /> : <HeartIcon />}
    </button>
  );
};

export default LikeButton;
