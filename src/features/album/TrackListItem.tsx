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
    <li className="bg-zinc-900 p-4 rounded-lg shadow-md w-full">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-gray-400 text-sm sm:text-lg w-8 text-center">
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
                  src={track.albumImageUrl || "/default-album.png"}
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
                {isCurrent && isPlaying ? (
                  // 일시정지 아이콘
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6"
                    />
                  </svg>
                ) : (
                  // 재생 아이콘
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-5.197-2.132A1 1 0 008 9.87v4.26a1 1 0 001.555.832l5.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TrackListItem;
