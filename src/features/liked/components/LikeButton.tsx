import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heartFill.svg";
import useLikeMutation from "@/features/liked/mutations/useLikeMutation";
import useUnlikeMutation from "@/features/liked/mutations/useUnlikeMutation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const { data: session } = useSession();

  const userId = session?.user.id;

  const [liked, setLiked] = useState<boolean>(false);

  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  useEffect(() => {
    const fetchLiked = async () => {
      if (!userId) {
        setLiked(false);
        return;
      }
      try {
        const response = await axios.get<{ liked: boolean }>(
          "/api/likes/check",
          {
            params: { userId, itemType, itemId },
          },
        );
        setLiked(response.data.liked);
      } catch (error: unknown) {
        JSON.stringify(error);
        setLiked(false);
      }
    };
    fetchLiked();
  }, [userId, itemType, itemId]);

  const handleClick = () => {
    if (!userId) {
      return;
    }
    if (liked) {
      const unlikePayload = { userId, itemType, itemId };
      unlikeMutation.mutate(unlikePayload, {
        onSuccess: () => {
          setLiked(false);
        },
      });
    } else {
      const likePayload = {
        userId,
        itemType,
        itemId,
        name,
        imageUrl,
        artists,
        followers,
        popularity,
        releaseDate,
      };
      likeMutation.mutate(likePayload, {
        onSuccess: () => {
          setLiked(true);
        },
      });
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
