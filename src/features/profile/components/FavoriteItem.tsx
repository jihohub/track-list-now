import TImage from "@/features/common/components/TImage";
import {
  FavoriteItemProps,
  UserFavoriteArtist,
  UserFavoriteTrack,
  isUserFavoriteArtist,
  isUserFavoriteTrack,
} from "@/types/favorite";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const FavoriteItem = ({
  item,
  type,
  isEditing,
  handleDelete,
}: FavoriteItemProps) => {
  const { t } = useTranslation("common");

  const content = (
    <div className="relative flex flex-col items-center">
      <div className="relative w-24 h-24">
        <TImage
          imageUrl={
            type === "artist"
              ? (item as UserFavoriteArtist).imageUrl
              : (item as UserFavoriteTrack).imageUrl
          }
          type={type}
          alt={item.name}
          size="w-24 h-24"
          className="opacity-80"
        />
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(
                type === "artist"
                  ? (item as UserFavoriteArtist).artistId
                  : (item as UserFavoriteTrack).trackId,
              );
            }}
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl ${
              type === "artist" ? "rounded-full" : "rounded-lg"
            }`}
            type="button"
            aria-label="delete item"
          >
            &times;
          </button>
        )}
      </div>

      <p className="text-white text-sm text-center mt-1 w-24 truncate">
        {item.name}
      </p>
      {type === "artist" && isUserFavoriteArtist(item) && (
        <p className="text-gray-400 text-sm text-center mt-1 w-24">
          {item.followers.toLocaleString()} {t("followers")}
        </p>
      )}
      {type === "track" && isUserFavoriteTrack(item) && (
        <p className="text-gray-400 text-sm text-center mt-1 w-24 truncate">
          {item.artists}
        </p>
      )}
    </div>
  );

  return isEditing ? (
    <div className="relative flex flex-col items-center">{content}</div>
  ) : (
    <Link
      href={
        type === "artist"
          ? `/artist/${(item as UserFavoriteArtist).artistId}`
          : `/track/${(item as UserFavoriteTrack).trackId}`
      }
    >
      {content}
    </Link>
  );
};

export default FavoriteItem;
