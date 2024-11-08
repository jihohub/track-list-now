import LikeButton from "@/features/liked/components/LikeButton";
import { SimplifiedTrack } from "@/types/album";
import Image from "next/image";

interface TrackInfoProps {
  track: SimplifiedTrack;
}

const TrackInfo = ({ track }: TrackInfoProps) => {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="flex items-center justify-between bg-zinc-800 w-full max-w-[480px] p-2 rounded-md">
      <div className="flex items-center space-x-4">
        <Image
          src={track.imageUrl || "/default-album.png"}
          alt={track.name}
          width={64}
          height={64}
          className="rounded-md"
        />
        <div>
          <h3 className="text-white font-semibold">{track.name}</h3>
          <p className="text-gray-400">{artistNames}</p>
        </div>
      </div>
      <div className="px-4">
        <LikeButton
          itemType="track"
          itemId={track.id}
          name={track.name}
          imageUrl={track.imageUrl}
          artists={artistNames}
          popularity={track.popularity}
        />
      </div>
    </div>
  );
};

export default TrackInfo;
