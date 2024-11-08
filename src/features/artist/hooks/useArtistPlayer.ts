import { ArtistPageData } from "@/types/artist";
import { useEffect, useState } from "react";

const useArtistPlayer = (data: ArtistPageData) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("volume");
      return savedVolume !== null ? Number(savedVolume) : 1;
    }
    return 1;
  });

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("volume", volume.toString());
    }
  }, [volume]);

  const handlePlay = (index: number) => {
    if (currentTrackIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (
      currentTrackIndex !== null &&
      currentTrackIndex < data.topTracks.tracks.length - 1
    ) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
    setIsPlaying(false);
  };

  const currentTrack =
    currentTrackIndex !== null
      ? data.topTracks.tracks[currentTrackIndex]
      : null;

  return {
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
  };
};

export default useArtistPlayer;
