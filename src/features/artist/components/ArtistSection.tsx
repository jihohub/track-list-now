import AudioPlayer from "@/features/audio/components/AudioPlayer";
import TImage from "@/features/common/components/TImage";
import { ArtistPageData } from "@/types/artist";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";
import LikeButton from "../../liked/components/LikeButton";
import TopTrackItem from "./TopTrackItem";

interface ArtistSectionProps {
  data: ArtistPageData;
}

const ArtistSection = ({ data }: ArtistSectionProps) => {
  const { t } = useTranslation(["common", "artist"]);

  const { artist, topTracks, relatedArtists } = data;

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("volume");
      return savedVolume !== null ? Number(savedVolume) : 1;
    }
    return 1;
  });

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("volume", volume.toString());
    }
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
      currentTrackIndex < data.topTracks.tracks.length - 1
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
    currentTrackIndex !== null
      ? data.topTracks.tracks[currentTrackIndex]
      : null;

  return (
    <div className="flex flex-col items-center">
      {/* 아티스트 기본 정보 */}
      <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
        <TImage
          imageUrl={artist.images[0]?.url || "/default-image.jpg"}
          type="artist"
          alt={artist.name}
          size="w-[300px] h-[300px]"
          className="rounded-full overflow-hidden"
        />
      </div>
      <h1 className="text-2xl font-bold text-white mt-4">{artist.name}</h1>
      <div className="flex justify-center items-center h-20">
        <LikeButton
          itemType="artist"
          itemId={artist.id}
          name={artist.name}
          imageUrl={artist.images[0].url}
          followers={artist.followers.total}
        />
      </div>

      <div className="w-full max-w-4xl">
        {/* Genres: 각 장르를 스타일링된 태그로 감싸기 */}
        <div className="flex flex-wrap justify-center mt-2 space-x-2">
          {artist.genres.length > 0 ? (
            artist.genres.map((genre) => (
              <span
                key={genre}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm mb-2"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm mb-2">
              N/A
            </span>
          )}
        </div>
      </div>

      {/* 탑 트랙 섹션 */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("top_tracks", { ns: "artist" })}
        </h2>
        <ul className="space-y-4">
          {topTracks.tracks.map((track, index) => (
            <TopTrackItem
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

      {/* 연관 아티스트 섹션 */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("related_artists", { ns: "artist" })}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedArtists.artists.map((relatedArtist) => (
            <li key={relatedArtist.id} className="flex flex-col items-center">
              <Link
                href={`/artist/${relatedArtist.id}`}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24">
                  <TImage
                    imageUrl={
                      relatedArtist.images[0]?.url || "/default-image.jpg"
                    }
                    type="artist"
                    alt={relatedArtist.name}
                    size="w-24 h-24"
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-white mt-3 text-center font-medium">
                  {relatedArtist.name}
                </span>
              </Link>
            </li>
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
        isAlbumPage={false}
      />
    </div>
  );
};

export default ArtistSection;
