import TImage from "@/features/common/TImage";
import { useTranslation } from "next-i18next";
import Link from "next/link";

export interface UserFavoriteArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface UserFavoriteTrack {
  trackId: string;
  name: string;
  albumImageUrl: string;
  artists: string;
  popularity: number;
}

export interface FavoriteItemProps {
  item: UserFavoriteArtist | UserFavoriteTrack;
  type: "artist" | "track";
  isEditing: boolean;
  handleDelete: (id: string) => void;
}

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
              : (item as UserFavoriteTrack).albumImageUrl
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
      {type === "artist" && "followers" in item && (
        <p className="text-gray-400 text-sm text-center mt-1 w-24">
          {item.followers.toLocaleString()} {t("followers")}
        </p>
      )}
      {type === "track" && "artists" in item && (
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
