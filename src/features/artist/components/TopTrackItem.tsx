import PauseIcon from "@/assets/icons/pause.svg";
import PlayIcon from "@/assets/icons/play.svg";
import TImage from "@/features/common/components/TImage";
import { SimplifiedTrack } from "@/types/album";
import Link from "next/link";

interface TopTrackItemProps {
  index: number;
  track: SimplifiedTrack;
  onPlay: () => void;
  isCurrent: boolean;
  isPlaying: boolean;
}

const TopTrackItem = ({
  index,
  track,
  onPlay,
  isCurrent,
  isPlaying,
}: TopTrackItemProps) => {
  return (
    <li className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg shadow-md">
      <Link
        href={`/track/${track.id}`}
        className="flex justify-between items-center w-full"
      >
        <div className="flex items-center space-x-4">
          <span className="font-bold text-gray-400 text-sm sm:text-lg w-4 sm:w-8 text-center">
            {index + 1}
          </span>
          <TImage
            imageUrl={track.imageUrl}
            type="track"
            alt={track.name}
            size="w-12 h-12 sm:w-16 sm:h-16"
            className="mr-4"
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs text-white font-semibold sm:text-sm">
              {track.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
        {track.previewUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onPlay();
            }}
            className="text-neonBlue hover:text-chefchaouenBlue focus:outline-none"
            type="button"
          >
            {isCurrent && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </Link>
    </li>
  );
};

export default TopTrackItem;
