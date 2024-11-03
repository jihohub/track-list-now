interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
}

const SeekBar = ({ currentTime, duration, onSeek }: SeekBarProps) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex justify-center items-center space-x-4 w-full">
      {/* 시간 표시 */}
      <span className="text-gray-400 text-sm whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {/* 시크 바 */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="xs:w-48 w-80"
      />
    </div>
  );
};

export default SeekBar;
