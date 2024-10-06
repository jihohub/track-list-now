import ArtistIcon from "@/assets/icons/artist.svg";
import TrackIcon from "@/assets/icons/track.svg";
import { ArtistOrTrackImageProps } from "@/types/types";

const ArtistOrTrackImage = ({
  imageUrl,
  type,
  alt,
  size = "w-16 h-16",
  className = "",
}: ArtistOrTrackImageProps) => {
  const defaultStyle = `flex items-center justify-center bg-black ${size} ${
    type === "artist" ? "rounded-full" : "rounded-lg"
  }`;

  return (
    <div className={`${defaultStyle} ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`${size} ${
            type === "artist" ? "rounded-full" : "rounded-lg"
          }`}
        />
      ) : type === "artist" ? (
        <ArtistIcon className="w-8 h-8 text-gray-500" />
      ) : (
        <TrackIcon className="w-8 h-8 text-gray-500" />
      )}
    </div>
  );
};

export default ArtistOrTrackImage;
