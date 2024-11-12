import { SimplifiedTrack } from "@/types/album";
import { useCallback, useEffect, useState } from "react";

const useArtistPlayer = (tracks: SimplifiedTrack[]) => {
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
    return tracks.reduce<number[]>((acc, track, index) => {
      if (track.previewUrl) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [tracks]);

  const findNextPlayableTrack = useCallback(
    (currentIndex: number) => {
      const playableTracks = getPlayableTracks();
      const currentPlayableIndex = playableTracks.findIndex(
        (index) => index === currentIndex,
      );
      // 다음 재생 가능한 트랙이 없으면 undefined 반환
      return currentPlayableIndex < playableTracks.length - 1
        ? playableTracks[currentPlayableIndex + 1]
        : undefined;
    },
    [getPlayableTracks],
  );

  const findPreviousPlayableTrack = useCallback(
    (currentIndex: number) => {
      const playableTracks = getPlayableTracks();
      const currentPlayableIndex = playableTracks.findIndex(
        (index) => index === currentIndex,
      );
      // 이전 재생 가능한 트랙이 없으면 undefined 반환
      return currentPlayableIndex > 0
        ? playableTracks[currentPlayableIndex - 1]
        : undefined;
    },
    [getPlayableTracks],
  );

  const getNavigationState = useCallback(() => {
    if (currentTrackIndex === null) {
      return { disablePrevious: true, disableNext: true };
    }

    const playableTracks = getPlayableTracks();
    const currentPlayableIndex = playableTracks.findIndex(
      (index) => index === currentTrackIndex,
    );

    // 재생 가능한 트랙 목록 내에서의 위치를 확인
    return {
      disablePrevious: currentPlayableIndex <= 0,
      disableNext:
        currentPlayableIndex >= playableTracks.length - 1 ||
        findNextPlayableTrack(currentTrackIndex) === undefined,
    };
  }, [currentTrackIndex, getPlayableTracks, findNextPlayableTrack]);

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
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;
  const { disablePrevious, disableNext } = getNavigationState();

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
    disablePrevious,
    disableNext,
  };
};

export default useArtistPlayer;
