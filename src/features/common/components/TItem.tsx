import TImage from "@/features/common/components/TImage";
import { TItemProps } from "@/types/ranking";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const TItem = ({ index, item, type, isFeatured = false }: TItemProps) => {
  const { t } = useTranslation("common");
  const linkHref =
    type === "artist"
      ? `/artist/${item.artist.artistId}`
      : `/track/${item.track.trackId}`;

  const name = type === "artist" ? item.artist.name : item.track.name;
  const imageUrl = isFeatured
    ? type === "artist"
      ? item.artist.imageUrl
      : item.track.imageUrl
    : type === "artist"
      ? item.artist.imageUrl
      : item.track.imageUrl;
  const alt = type === "artist" ? item.artist.name : item.track.name;
  const followers = type === "artist" ? item.artist.followers : 0;
  const artists = type === "track" ? item.track.artists : null;

  return (
    <li
      className={`flex justify-between items-center ${isFeatured ? "bg-transparent mb-4" : "bg-zinc-900 p-2 rounded-lg shadow-md"}`}
    >
      <Link
        href={linkHref}
        className="flex justify-between items-center w-full"
      >
        <div className={`flex items-center ${isFeatured ? "" : "space-x-4"}`}>
          <span
            className={`font-bold text-gray-400 ${isFeatured ? "text-sm sm:text-lg mr-4" : "text-sm sm:text-lg w-4 sm:w-8 text-center"}`}
          >
            {index + 1}
          </span>
          <TImage
            imageUrl={imageUrl}
            type={type}
            alt={alt}
            size="w-10 h-10 sm:w-12 sm:h-12"
            className="mr-4"
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs text-white font-semibold sm:text-sm">
              {name}
            </h3>
            {type === "artist" ? (
              <p className="text-xs sm:text-sm text-gray-400">
                {followers.toLocaleString()} {t("followers")}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-400">{artists}</p>
            )}
          </div>
        </div>
        {item.count && (
          <div className="sm:px-2 text-right">
            <p className="text-xs sm:text-sm text-blue-300 truncate">
              {item.count}
              {t("selected")}
            </p>
          </div>
        )}
      </Link>
    </li>
  );
};

export default TItem;
