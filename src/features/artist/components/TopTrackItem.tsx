import TImage from "@/features/common/components/TImage";
import Link from "next/link";

interface TopTrackItemProps {
  index: number;
  track: {
    id: string;
    name: string;
    album: { images: { url: string }[] };
    artists: { name: string }[];
  };
}

const TopTrackItem = ({ index, track }: TopTrackItemProps) => {
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
            imageUrl={track.album.images[0].url}
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
      </Link>
    </li>
  );
};

export default TopTrackItem;
