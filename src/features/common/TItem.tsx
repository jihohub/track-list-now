import { TItemProps } from "@/types/ranking";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import TImage from "./TImage";

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
      : item.track.albumImageUrl
    : type === "artist"
      ? item.artist.imageUrl
      : item.track.albumImageUrl;
  const alt = type === "artist" ? item.artist.name : item.track.name;
  const followers = type === "artist" ? item.artist.followers : 0;
  const artists = type === "track" ? item.track.artists : null;

  return (
    <li
      className={`flex justify-between items-center ${isFeatured ? "bg-transparent mb-4" : "bg-zinc-900 p-4 rounded-lg shadow-md"}`}
    >
      <Link
        href={linkHref}
        className="flex justify-between items-center w-full"
      >
        <div className={`flex items-center ${isFeatured ? "" : "space-x-4"}`}>
          <span
            className={`font-bold text-gray-400 ${isFeatured ? "text-xl sm:text-xl mr-4" : "text-sm sm:text-lg w-8 sm:w-12 text-center"}`}
          >
            {index + 1}
          </span>
          <TImage
            imageUrl={imageUrl}
            type={type}
            alt={alt}
            size="w-12 h-12 sm:w-16 sm:h-16"
            className="mr-4"
          />
          <div>
            <h3
              className={`text-xs text-white font-semibold ${isFeatured ? "sm:text-sm max-w-[100px] sm:max-w-[220px]" : "sm:text-lg max-w-[150px] sm:max-w-max"}`}
            >
              {name}
            </h3>
            {type === "artist" ? (
              <p
                className={`text-xs sm:text-sm text-gray-400 ${isFeatured ? "max-w-[100px] sm:max-w-[220px]" : "max-w-[150px] sm:max-w-max"}`}
              >
                {followers.toLocaleString()} {t("followers")}
              </p>
            ) : (
              <p
                className={`text-xs sm:text-sm text-gray-400 ${isFeatured ? "max-w-[100px] sm:max-w-[220px]" : "max-w-[150px] sm:max-w-max"}`}
              >
                {artists}
              </p>
            )}
          </div>
        </div>
        {item.count && (
          <div className="text-right">
            <p className="text-xs sm:text-sm text-blue-300">
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
