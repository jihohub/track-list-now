import TImage from "@/features/common/components/TImage";
import LikeButton from "@/features/liked/components/LikeButton";
import { ArtistPageData } from "@/types/artist";

interface OverviewSectionProps {
  artist: ArtistPageData["artist"];
}

const OverviewSection = ({ artist }: OverviewSectionProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
        <TImage
          imageUrl={artist.images[0]?.url || "/default-image.jpg"}
          type="artist"
          alt={artist.name}
          size="w-[300px] h-[300px]"
          className="rounded-full"
        />
      </div>
      <h1 className="text-2xl font-bold text-white mt-4">{artist.name}</h1>
      <div className="flex justify-center items-center h-20">
        <LikeButton
          itemType="artist"
          itemId={artist.id}
          name={artist.name}
          imageUrl={artist.images[0]?.url}
          followers={artist.followers.total}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-5 mt-2 mb-10 px-2 xm:px-4">
        {artist.genres.map((genre) => (
          <span
            key={genre}
            className="bg-zinc-300 text-black px-5 py-2 rounded-md text-sm"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OverviewSection;
