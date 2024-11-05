import PauseIcon from "@/assets/icons/pause.svg";
import PlayIcon from "@/assets/icons/play.svg";
import { TrackListItemProps } from "@/types/album";
import Image from "next/image";
import Link from "next/link";

const TrackListItem = ({
  index,
  track,
  onPlay,
  isCurrent,
  isPlaying,
}: TrackListItemProps) => {
  return (
    <li className="bg-zinc-900 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-gray-400 text-sm sm:text-lg w-4 sm:w-8 text-center">
          {index + 1}
        </span>
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <Link
              href={`/track/${track.id}`}
              className="flex items-center w-full"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={track.imageUrl || "/default-album.png"}
                  alt={track.name}
                  width={36}
                  height={36}
                  className="rounded-md"
                />
                <div className="flex flex-col w-full">
                  <h3 className="text-xs text-white font-semibold sm:text-sm sm:max-w-max">
                    {track.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 sm:max-w-max">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </div>
            </Link>
            {track.previewUrl && (
              <button
                onClick={onPlay}
                className="text-neonBlue hover:text-chefchaouenBlue focus:outline-none"
                type="button"
              >
                {isCurrent && isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TrackListItem;
