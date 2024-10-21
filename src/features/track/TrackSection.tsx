import { TrackDetail } from "@/types/track";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";

interface TrackSectionProps {
  track: TrackDetail;
}

const TrackSection = ({ track }: TrackSectionProps) => {
  const { t } = useTranslation(["common", "track"]);

  return (
    <div className="flex flex-col items-center">
      <Image
        src={track.album.images[0]?.url || "/default-image.jpg"}
        alt={track.name}
        width={300}
        height={300}
        className="rounded-md"
      />
      <h1 className="text-4xl font-bold text-white mt-4">{track.name}</h1>
      <div className="w-80">
        <p className="text-gray-400 mt-2">
          {t("artists", { ns: "track" })}:{" "}
          {track.artists.map((artist, index) => (
            <span key={artist.id} className="inline-flex items-center">
              <Link href={`/artist/${artist.id}`}>
                <span className="text-green-500 hover:underline">
                  {artist.name}
                </span>
              </Link>
              {index < track.artists.length - 1 && (
                <span className="ml-1 mr-2">,</span>
              )}
            </span>
          ))}
        </p>
        <p className="text-gray-400 mt-1">
          {t("album", { ns: "track" })}:{" "}
          <Link href={`/album/${track.album.id}`}>
            <span className="text-green-500 hover:underline">
              {track.album.name}
            </span>
          </Link>
        </p>
        <p className="text-gray-400 mt-1">
          {t("release_date", { ns: "track" })}: {track.album.release_date}
        </p>
        <p className="text-gray-400 mt-1">
          {t("duration", { ns: "track" })}:{" "}
          {Math.floor(track.duration_ms / 60000)}:
          {`0${Math.floor((track.duration_ms % 60000) / 1000)}`.slice(-2)}
        </p>
      </div>
      {track.preview_url && (
        /* eslint-disable jsx-a11y/media-has-caption */
        <audio controls className="mt-4 w-80">
          <source src={track.preview_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TrackSection;
