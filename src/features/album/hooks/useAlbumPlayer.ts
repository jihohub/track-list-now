import { SimplifiedAlbum } from "@/types/album";
import { useCallback, useEffect, useState } from "react";

const useAlbumPlayer = (album: SimplifiedAlbum) => {
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

  const getPlayableTracks = useCallback(() => {
    return album.tracks.items.reduce<number[]>((acc, track, index) => {
      if (track.previewUrl) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [album.tracks.items]);

  const findNextPlayableTrack = useCallback(
    (currentIndex: number) => {
      const playableTracks = getPlayableTracks();
      const currentPlayableIndex = playableTracks.findIndex(
        (index) => index === currentIndex,
      );
      return playableTracks[currentPlayableIndex + 1];
    },
    [getPlayableTracks],
  );

  const findPreviousPlayableTrack = useCallback(
    (currentIndex: number) => {
      const playableTracks = getPlayableTracks();
      const currentPlayableIndex = playableTracks.findIndex(
        (index) => index === currentIndex,
      );
      return playableTracks[currentPlayableIndex - 1];
    },
    [getPlayableTracks],
  );

  const handlePlay = (index: number) => {
    if (currentTrackIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNext = useCallback(() => {
    if (currentTrackIndex === null) return;

    const nextPlayableIndex = findNextPlayableTrack(currentTrackIndex);
    if (nextPlayableIndex !== undefined) {
      setCurrentTrackIndex(nextPlayableIndex);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, findNextPlayableTrack]);

  const handlePrevious = useCallback(() => {
    if (currentTrackIndex === null) return;

    const previousPlayableIndex = findPreviousPlayableTrack(currentTrackIndex);
    if (previousPlayableIndex !== undefined) {
      setCurrentTrackIndex(previousPlayableIndex);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, findPreviousPlayableTrack]);

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
    setIsPlaying(false);
  };

  const currentTrack =
    currentTrackIndex !== null ? album.tracks.items[currentTrackIndex] : null;

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

export default useAlbumPlayer;