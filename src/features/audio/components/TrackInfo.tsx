import { SimplifiedTrack } from "@/types/album";
import Image from "next/image";

interface TrackInfoProps {
  track: SimplifiedTrack;
}

const TrackInfo = ({ track }: TrackInfoProps) => {
  return (
    <div className="flex items-center bg-zinc-800 space-x-4 w-full max-w-[480px] p-2 rounded-md">
      <Image
        src={track.imageUrl || "/default-album.png"}
        alt={track.name}
        width={64}
        height={64}
        className="rounded-md"
      />
      <div>
        <h3 className="text-white font-semibold">{track.name}</h3>
        <p className="text-gray-400">
          {track.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
