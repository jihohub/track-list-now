import TrackListItem from "@/features/album/TrackListItem";
import AudioPlayer from "@/features/audio/AudioPlayer";
import { SimplifiedAlbum, SimplifiedTrack } from "@/types/album";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AlbumSectionProps {
  album: SimplifiedAlbum;
}

const AlbumSection = ({ album }: AlbumSectionProps) => {
  const { t } = useTranslation(["common", "album"]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);

  const handlePlay = (index: number) => {
    if (currentTrackIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (
      currentTrackIndex !== null &&
      currentTrackIndex < album.tracks.items.length - 1
    ) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
    setIsPlaying(false);
  };

  const currentTrack =
    currentTrackIndex !== null ? album.tracks.items[currentTrackIndex] : null;

  return (
    <div
      className={`flex flex-col items-center ${currentTrackIndex && "pb-60 md:pb-40 desktop:pb-20"}`}
    >
      <Image
        src={album.images[0]?.url || "/default-image.jpg"}
        alt={album.name}
        width={300}
        height={300}
        className="rounded-md"
      />
      <h1 className="text-4xl font-bold text-white mt-4">{album.name}</h1>
      <div className="w-full max-w-4xl px-4">
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
      <div className="w-full mt-4 px-4">
        <h2 className="text-2xl font-semibold text-white mb-2">
          {t("tracks", { ns: "album" })}
        </h2>
        <ul className="w-full space-y-4">
          {album.tracks.items.map((track: SimplifiedTrack, index: number) => (
            <TrackListItem
              key={track.id}
              index={index}
              track={track}
              onPlay={() => handlePlay(index)}
              isCurrent={currentTrackIndex === index}
              isPlaying={isPlaying}
            />
          ))}
        </ul>
      </div>
      <AudioPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClose={handleClosePlayer}
        volume={volume}
        setVolume={setVolume}
        isAlbumPage
      />
    </div>
  );
};

export default AlbumSection;
