import AudioElement, {
  AudioElementHandle,
} from "@/features/audio/components/AudioElement";
import CloseButton from "@/features/audio/components/CloseButton";
import PlaybackControls from "@/features/audio/components/PlaybackControls";
import SeekBar from "@/features/audio/components/SeekBar";
import TrackInfo from "@/features/audio/components/TrackInfo";
import VolumeControl from "@/features/audio/components/VolumeControl";
import { AudioPlayerProps } from "@/types/album";
import React, { useCallback, useRef, useState } from "react";

const AudioPlayerComponent = ({
  track,
  isPlaying,
  setIsPlaying,
  onPrevious,
  onNext,
  onClose,
  volume,
  setVolume,
  enableClose,
  disablePrevious,
  disableNext,
}: AudioPlayerProps) => {
  const audioElementRef = useRef<AudioElementHandle | null>(null);

  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const handleSeek = useCallback((value: number) => {
    setCurrentSeconds(value);
    if (audioElementRef.current) {
      audioElementRef.current.seek(value);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (value: number) => {
      setVolume(value);
    },
    [setVolume],
  );

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentSeconds(durationSeconds);
    // 자동으로 다음 트랙으로 넘어가려면 onNext 호출
    // onNext();
  }, [durationSeconds, setIsPlaying]);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      const flooredTime = Math.floor(time);
      const flooredDuration = Math.floor(durationSeconds);
      if (flooredTime !== currentSeconds) {
        setCurrentSeconds(Math.min(flooredTime, flooredDuration));
      }
    },
    [currentSeconds, durationSeconds],
  );

  const handleLoadedMetadata = useCallback((metaDuration: number) => {
    setDurationSeconds(Math.floor(metaDuration));
  }, []);

  if (!track) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-zinc-700 p-4 flex flex-col desktop:flex-row items-center justify-between z-50">
      {/* 닫기 버튼 */}
      {enableClose && <CloseButton onClose={onClose} />}

      {/* 트랙 정보 */}
      <TrackInfo track={track} />

      {/* 재생 컨트롤 */}
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onPrevious={onPrevious}
        onNext={onNext}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
      />

      {/* 시크 바 및 볼륨 조절 */}
      <div className="flex justify-center items-center space-x-4">
        {/* 시간 표시 및 시크 바 */}
        <SeekBar
          currentTime={currentSeconds}
          duration={durationSeconds}
          onSeek={handleSeek}
        />

        {/* 볼륨 조절 */}
        <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
      </div>

      {/* 오디오 요소 */}
      <AudioElement
        ref={audioElementRef}
        track={track}
        isPlaying={isPlaying}
        volume={volume}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

const AudioPlayer = React.memo(AudioPlayerComponent);
AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
