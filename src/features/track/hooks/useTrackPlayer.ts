import { SimplifiedTrack } from "@/types/album";
import { TrackDetail } from "@/types/track";
import { useEffect, useState } from "react";

const useTrackPlayer = (track: TrackDetail) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("volume");
      return savedVolume !== null ? Number(savedVolume) : 1;
    }
    return 1;
  });
  const [animate, setAnimate] = useState<boolean>(false);
  const [simplifiedTrack, setSimplifiedTrack] =
    useState<SimplifiedTrack | null>({
      id: track.id,
      name: track.name,
      artists: track.artists,
      previewUrl: track.preview_url,
      durationMs: track.duration_ms,
      imageUrl: track.album.images[0]?.url || "/default-album.png",
    });

  useEffect(() => {
    if (isPlaying) {
      setAnimate(true);
    }
  }, [isPlaying]);

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

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSimplifiedTrack(null);
  };

  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    animate,
    simplifiedTrack,
    handleClosePlayer,
  };
};

export default useTrackPlayer;
