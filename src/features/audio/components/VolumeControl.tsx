import VolumeHighIcon from "@/assets/icons/volumeHigh.svg";
import VolumeLowIcon from "@/assets/icons/volumeLow.svg";
import VolumeMuteIcon from "@/assets/icons/volumeMute.svg";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const getVolumeIcon = () => {
    if (volume === 0) {
      // 음소거 아이콘
      return <VolumeMuteIcon />;
    }

    if (volume < 0.5) {
      // 볼륨 낮음 아이콘
      return <VolumeLowIcon />;
    }

    // 볼륨 높음 아이콘
    return <VolumeHighIcon />;
  };

  return (
    <div className="flex items-center mobile:space-x-0 space-x-2 mobile:hidden tablet:hidden">
      {/* 볼륨 아이콘 */}
      {getVolumeIcon()}
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="mobile:w-12 w-24"
        aria-label="Volume Control"
      />
    </div>
  );
};

export default VolumeControl;
