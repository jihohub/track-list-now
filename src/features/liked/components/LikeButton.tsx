import HeartFillIcon from "@/assets/icons/heartFill.svg";
import useLikeState from "@/features/liked/hooks/useLikeState";
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

const LikeButton = (props: LikeButtonProps) => {
  const { itemType, itemId, ...itemData } = props;
  const { data: session, status } = useSession();
  const { liked, toggleLike } = useLikeState(itemType, itemId);

  if (status === "unauthenticated" || !session?.user.id) {
    return null;
  }

  return (
    <button
      onClick={() => toggleLike(itemData)}
      className={liked ? "text-vividSkyBlue" : "text-gray-500"}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this item" : "Like this item"}
      type="button"
    >
      <HeartFillIcon />
    </button>
  );
};

export default LikeButton;
