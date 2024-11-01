import AudioPlayer from "@/features/audio/AudioPlayer";
import LikeButton from "@/features/liked/LikeButton";
import { SimplifiedTrack } from "@/types/album";
import { TrackDetail } from "@/types/track";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TrackSectionProps {
  track: TrackDetail;
}

const TrackSection = ({ track }: TrackSectionProps) => {
  const { t } = useTranslation(["common", "track"]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [simplifiedTrack, setSimplifiedTrack] =
    useState<SimplifiedTrack | null>({
      id: track.id,
      name: track.name,
      artists: track.artists,
      previewUrl: track.preview_url,
      durationMs: track.duration_ms,
      imageUrl: track.album.images[0]?.url || "/default-album.png",
    });
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaying) {
      setAnimate(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 500); // 애니메이션 지속 시간과 일치
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSimplifiedTrack(null);
  };

  return (
    <div
      className={`flex flex-col items-center ${simplifiedTrack && "pb-60 md:pb-40 desktop:pb-20"}`}
    >
      <Image
        src={track.album.images[0]?.url || "/default-image.jpg"}
        alt={track.name}
        width={300}
        height={300}
        className={`rounded-md transition-transform duration-500 ${
          animate ? "animate-scalePulse" : ""
        }`}
      />
      <h1 className="text-2xl font-bold text-white mt-4">{track.name}</h1>
      <div className="flex justify-center items-center h-20">
        <LikeButton
          itemType="track"
          itemId={track.id}
          name={track.name}
          imageUrl={track.album.images[0].url}
          artists={track.artists.map((artist) => artist.name).join(", ")}
          popularity={track.popularity}
        />
      </div>
      <div className="w-full max-w-4xl px-4">
        <p className="text-gray-400 mt-2">
          {t("artists", { ns: "track" })}:{" "}
          {track.artists.map((artist, index) => (
            <span key={artist.id} className="inline-flex items-center">
              <Link href={`/artist/${artist.id}`}>
                <span className="text-chefchaouenBlue hover:underline">
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
            <span className="text-chefchaouenBlue hover:underline">
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
        <AudioPlayer
          track={simplifiedTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onPrevious={() => {}} // 단일 트랙이므로 빈 함수 전달
          onNext={() => {}} // 단일 트랙이므로 빈 함수 전달
          onClose={handleClosePlayer}
          volume={volume}
          setVolume={setVolume}
          isAlbumPage={false}
        />
      )}
    </div>
  );
};

export default TrackSection;
