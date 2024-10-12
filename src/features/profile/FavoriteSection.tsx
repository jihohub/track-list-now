// /features/profile/FavoriteSection.tsx
import AddIcon from "@/assets/icons/add.svg";
import ArtistIcon from "@/assets/icons/artist.svg";
import TrackIcon from "@/assets/icons/track.svg";
import { FavoriteSectionProps } from "@/types/types";
import { useTranslation } from "next-i18next";
import TImage from "../common/TImage";

const FavoriteSection = ({
  title,
  items,
  openModal,
  type,
  isEditing,
  handleDelete,
}: FavoriteSectionProps) => {
  const { t } = useTranslation("common");
  return (
    <div className="mb-8 bg-zinc-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative flex flex-col items-center">
            {item && (
              <div className="relative flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <TImage
                    imageUrl={
                      type === "artist" ? item?.imageUrl : item?.albumImageUrl
                    }
                    type={type}
                    alt={item.name}
                    size="w-24 h-24"
                    className="opacity-80"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl ${
                        type === "artist" ? "rounded-full" : "rounded-lg"
                      }`}
                    >
                      &times;
                    </button>
                  )}
                </div>

                <p className="text-white text-sm text-center mt-1 w-24 truncate">
                  {item.name}
                </p>
                {type === "artist" && item.followers && (
                  <p className="text-gray-400 text-sm text-center mt-1 w-24">
                    {item.followers.toLocaleString()} {t("followers")}
                  </p>
                )}
                {type === "track" && item.artists && (
                  <p className="text-gray-400 text-sm text-center mt-1 w-24 truncate">
                    {item.artists.map((artist) => artist.name).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {items.length < 3 &&
          Array.from({ length: 3 - items.length }).map((_, idx) => (
            <div
              key={`add-button-${idx}`}
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
};

export default FavoriteSection;
