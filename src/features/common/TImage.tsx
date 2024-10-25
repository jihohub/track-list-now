import ArtistIcon from "@/assets/icons/artist.svg";
import TrackIcon from "@/assets/icons/track.svg";
import parseSizes from "@/libs/utils/parseSizes";
import { TImageProps } from "@/types/types";
import Image from "next/image";

const TImage = ({
  imageUrl,
  type,
  alt,
  size = "w-16 h-16",
  className = "",
}: TImageProps) => {
  const defaultStyle = `flex items-center justify-center bg-black relative ${size} ${
    type === "artist" ? "rounded-full" : "rounded-lg"
  }`;

  const sizes = parseSizes(size);

  return (
    <div className={`${defaultStyle} ${className}`}>
      {imageUrl ? (
        <div
          className={`relative ${size} ${
            type === "artist" ? "rounded-full" : "rounded-lg"
          } overflow-hidden`}
        >
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes={sizes}
            className={`${type === "artist" ? "rounded-full" : "rounded-lg"} object-cover`}
          />
        </div>
      ) : type === "artist" ? (
        <ArtistIcon className="w-8 h-8 text-gray-500" />
      ) : (
        <TrackIcon className="w-8 h-8 text-gray-500" />
      )}
    </div>
  );
};

export default TImage;
