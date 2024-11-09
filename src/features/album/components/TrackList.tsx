import TrackListItem from "@/features/album/components/TrackListItem";
import { SimplifiedTrack } from "@/types/album";
import { useTranslation } from "next-i18next";

const TrackList = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onPlay,
}: {
  tracks: SimplifiedTrack[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onPlay: (index: number) => void;
}) => {
  const { t } = useTranslation(["common", "album"]);

  return (
    <div className="w-full mt-4">
      <h2 className="text-2xl font-semibold text-white mb-2">
        {t("tracks", { ns: "album" })}
      </h2>
      <ul className="w-full space-y-4">
        {tracks.map((track, index) => (
          <TrackListItem
            key={track.id}
            index={index}
            track={track}
            onPlay={() => onPlay(index)}
            isCurrent={currentTrackIndex === index}
            isPlaying={isPlaying}
          />
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
