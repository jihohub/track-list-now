import NextIcon from "@/assets/icons/next.svg";
import PauseIcon from "@/assets/icons/pause.svg";
import PlayIcon from "@/assets/icons/play.svg";
import PrevIcon from "@/assets/icons/prev.svg";
import { PlaybackControlsProps } from "@/types/album";

const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}: PlaybackControlsProps) => {
  return (
    <div className="flex justify-center items-center space-x-6 w-full h-[50px]">
      {/* 이전 버튼 */}
      <button
        onClick={onPrevious}
        className="text-gray-400 hover:text-gray-300 focus:outline-none"
        disabled={disablePrevious}
        type="button"
        aria-label="Previous Track"
      >
        {/* 이전 아이콘 */}
        <PrevIcon />
      </button>

      {/* 재생/일시정지 버튼 */}
      <button
        onClick={onPlayPause}
        className="text-neonBlue hover:text-chefchaouenBlue focus:outline-none"
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          // 일시정지 아이콘
          <PauseIcon />
        ) : (
          // 재생 아이콘
          <PlayIcon />
        )}
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        className="text-gray-400 hover:text-gray-300 focus:outline-none"
        disabled={disableNext}
        type="button"
        aria-label="Next Track"
      >
        {/* 다음 아이콘 */}
        <NextIcon />
      </button>
    </div>
  );
};

export default PlaybackControls;
