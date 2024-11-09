import { SimplifiedAlbum } from "@/types/album";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const AlbumInfo = ({ album }: { album: SimplifiedAlbum }) => {
  const { t } = useTranslation(["common", "album"]);

  return (
    <div className="w-full max-w-4xl">
      <p className="text-gray-400 mt-2">
        {t("artists", { ns: "album" })}:{" "}
        {album.artists.map((artist, index) => (
          <span key={artist.id} className="inline-flex items-center">
            <Link href={`/artist/${artist.id}`}>
              <span className="text-chefchaouenBlue hover:underline">
                {artist.name}
              </span>
            </Link>
            {index < album.artists.length - 1 && (
              <span className="ml-1 mr-2">,</span>
            )}
          </span>
        ))}
      </p>
      <p className="text-gray-400 mt-1">
        {t("release_date", { ns: "album" })}: {album.releaseDate}
      </p>
      <p className="text-gray-400 mt-1">
        {t("total_tracks", { ns: "album" })}: {album.totalTracks}
      </p>
      <p className="text-gray-400 mt-1">
        {t("label", { ns: "album" })}: {album.label}
      </p>
    </div>
  );
};

export default AlbumInfo;
