import TopTrackItem from "@/features/artist/components/TopTrackItem";
import useArtistPlayer from "@/features/artist/hooks/useArtistPlayer";
import AudioPlayer from "@/features/audio/components/AudioPlayer";
import { SimplifiedTrack } from "@/types/album";
import { useTranslation } from "react-i18next";

interface TopTracksTabProps {
  tracks: SimplifiedTrack[];
}

const TopTracksTab = ({ tracks }: TopTracksTabProps) => {
  const { t } = useTranslation(["artist"]);
  const {
    currentTrackIndex,
    isPlaying,
    volume,
    setVolume,
    setIsPlaying,
    handlePlay,
    handlePrevious,
    handleNext,
    handleClosePlayer,
    currentTrack,
  } = useArtistPlayer(tracks);

  return (
    <div
      className={`space-y-4 ${currentTrack ? "pb-60 md:pb-40 desktop:pb-20" : ""}`}
    >
      <h2 className="text-2xl font-semibold text-white mb-4">
        {t("top_tracks")}
      </h2>
      <ul className="space-y-4">
        {tracks.map((track, index) => (
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
      {currentTrack && (
        <AudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onClose={handleClosePlayer}
          volume={volume}
          setVolume={setVolume}
          enableClose
        />
      )}
    </div>
  );
};

export default TopTracksTab;
