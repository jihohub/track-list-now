import AddIcon from "@/assets/icons/add.svg";
import ArtistIcon from "@/assets/icons/artist.svg";
import TrackIcon from "@/assets/icons/track.svg";
import {
  FavoriteSectionProps,
  UserFavoriteArtist,
  UserFavoriteTrack,
} from "@/types/favorite";
import FavoriteItem from "./FavoriteItem";

const FavoriteSection = ({
  title,
  items,
  openModal,
  type,
  isEditing,
  handleDelete,
}: FavoriteSectionProps) => (
  <div className="mb-8 bg-zinc-900 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <FavoriteItem
          key={
            type === "artist"
              ? (item as UserFavoriteArtist).artistId
              : (item as UserFavoriteTrack).trackId
          }
          item={item}
          type={type}
          isEditing={isEditing}
          handleDelete={handleDelete}
        />
      ))}

      {items.length < 3 &&
        Array.from({ length: 3 - items.length }).map((item, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`placeholder-${type}-${index}`}
            className="flex flex-col items-center"
          >
            <button
              onClick={isEditing ? openModal : undefined}
              className={`flex items-center justify-center w-24 h-24 ${
                type === "track" ? "rounded-lg" : "rounded-full"
              }`}
              style={{
                backgroundColor: "black",
                cursor: isEditing ? "pointer" : "default",
              }}
              disabled={!isEditing}
              type="button"
            >
              {isEditing ? (
                <AddIcon className="w-8 h-8 text-white" />
              ) : type === "artist" ? (
                <ArtistIcon className="w-8 h-8 text-gray-500" />
              ) : (
                <TrackIcon className="w-8 h-8 text-gray-500" />
              )}
            </button>
          </div>
        ))}
    </div>
  </div>
);

export default FavoriteSection;
