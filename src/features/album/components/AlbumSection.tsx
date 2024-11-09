import AlbumInfo from "@/features/album/components/AlbumInfo";
import TrackList from "@/features/album/components/TrackList";
import useAlbumPlayer from "@/features/album/hooks/useAlbumPlayer";
import AudioPlayer from "@/features/audio/components/AudioPlayer";
import LikeButton from "@/features/liked/components/LikeButton";
import { SimplifiedAlbum } from "@/types/album";
import Image from "next/image";

interface AlbumSectionProps {
  album: SimplifiedAlbum;
}

const AlbumSection = ({ album }: AlbumSectionProps) => {
  const {
    currentTrackIndex,
    isPlaying,
    volume,
    setVolume,
    setIsPlaying,
    handlePlay,
    handlePrevious,
    handleNext,
    handleClosePlayer,
    currentTrack,
  } = useAlbumPlayer(album);

  return (
    <div
      className={`flex flex-col items-center ${currentTrack && "pb-60 md:pb-40 desktop:pb-20"}`}
    >
      <Image
        src={album.images[0]?.url || "/default-image.jpg"}
        alt={album.name}
        width={300}
        height={300}
        className="rounded-md"
      />
      <h1 className="text-2xl font-bold text-white mt-4">{album.name}</h1>
      <div className="flex justify-center items-center h-20">
        <LikeButton
          itemType="album"
          itemId={album.id}
          name={album.name}
          imageUrl={album.images[0].url}
          artists={album.artists.map((artist) => artist.name).join(", ")}
          releaseDate={album.releaseDate}
        />
      </div>

      <AlbumInfo album={album} />
      <TrackList
        tracks={album.tracks.items}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onPlay={handlePlay}
      />

      <AudioPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClose={handleClosePlayer}
        volume={volume}
        setVolume={setVolume}
        enableClose
      />
    </div>
  );
};

export default AlbumSection;
