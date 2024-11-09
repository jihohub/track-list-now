import { AudioPlayerProps } from "@/types/album";
import React, { useRef, useState } from "react";
import AudioElement, { AudioElementHandle } from "./AudioElement";
import CloseButton from "./CloseButton";
import PlaybackControls from "./PlaybackControls";
import SeekBar from "./SeekBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";

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
}: AudioPlayerProps) => {
  const audioElementRef = useRef<AudioElementHandle | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const handleSeek = (value: number) => {
    setCurrentTime(value);
    if (audioElementRef.current) {
      audioElementRef.current.seek(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // 자동으로 다음 트랙으로 넘어가려면 onNext 호출
    // onNext();
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleLoadedMetadata = (metaDuration: number) => {
    setDuration(metaDuration);
  };

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
        disablePrevious={false} // 필요에 따라 비활성화 로직 추가
        disableNext={false} // 필요에 따라 비활성화 로직 추가
      />

      {/* 시크 바 및 볼륨 조절 */}
      <div className="flex justify-center items-center space-x-4">
        {/* 시간 표시 및 시크 바 */}
        <SeekBar
          currentTime={currentTime}
          duration={duration}
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
