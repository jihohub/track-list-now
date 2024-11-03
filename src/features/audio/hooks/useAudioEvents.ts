import { useEffect } from "react";

const useAudioEvents = (
  audioRef: React.RefObject<HTMLAudioElement>,
  onEnded: () => void,
  onTimeUpdate: (currentTime: number) => void,
  onLoadedMetadata: (duration: number) => void,
) => {
  /* eslint-disable consistent-return */
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => onEnded();
      const handleTimeUpdate = () => onTimeUpdate(audio.currentTime);
      const handleLoadedMetadata = () => onLoadedMetadata(audio.duration);

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [audioRef, onEnded, onTimeUpdate, onLoadedMetadata]);
};

export default useAudioEvents;
