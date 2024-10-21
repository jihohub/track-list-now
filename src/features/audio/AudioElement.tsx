import useAudioEvents from "@/hooks/useAudioEvents";
import { SimplifiedTrack } from "@/types/album";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface AudioElementProps {
  track: SimplifiedTrack | null;
  isPlaying: boolean;
  volume: number;
  onEnded: () => void;
  onTimeUpdate: (currentTime: number) => void;
  onLoadedMetadata: (duration: number) => void;
}

export interface AudioElementHandle {
  seek: (value: number) => void;
}

const AudioElement = forwardRef<AudioElementHandle, AudioElementProps>(
  (
    {
      track,
      isPlaying,
      volume,
      onEnded,
      onTimeUpdate,
      onLoadedMetadata,
    }: AudioElementProps,
    ref,
  ) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 외부에서 seek 함수 호출 가능하게 설정
    useImperativeHandle(ref, () => ({
      seek: (value: number) => {
        if (audioRef.current) {
          audioRef.current.currentTime = value;
        }
      },
    }));

    // 트랙 변경 시 src 설정 및 로드
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      const audio = audioRef.current;
      if (audio && track?.previewUrl) {
        audio.src = track.previewUrl;
        audio.load();

        // 볼륨 설정
        audio.volume = volume;
        if (isPlaying) {
          audio.play();
        }
      }
    }, [track, volume]);

    // 재생 상태 변경 시 play/pause
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        if (isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    }, [isPlaying]);

    // 볼륨 변경 시 오디오 볼륨 업데이트
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = volume;
      }
    }, [volume]);

    // 이벤트 리스너 설정 (커스텀 훅 사용)
    useAudioEvents(audioRef, onEnded, onTimeUpdate, onLoadedMetadata);

    /* eslint-disable jsx-a11y/media-has-caption */
    return <audio ref={audioRef} />;
  },
);

// displayName 설정
AudioElement.displayName = "AudioElement";

export default AudioElement;
