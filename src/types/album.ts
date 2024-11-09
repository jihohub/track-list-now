export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  type: "album";
  uri: string;
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
  }>;
}

export interface SimplifiedArtist {
  id: string;
  name: string;
}

export interface SimplifiedTrack {
  id: string;
  name: string;
  artists: SimplifiedArtist[];
  previewUrl: string | null;
  durationMs: number;
  imageUrl: string;
  popularity: number;
}

export interface SimplifiedTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SimplifiedTrack[];
}

export interface SimplifiedAlbum {
  totalTracks: number;
  externalUrls: {
    spotify: string;
  };
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  releaseDate: string;
  artists: Array<SimplifiedArtist>;
  label: string;
  tracks: SimplifiedTracks;
}

export type AlbumResponseData = SimplifiedAlbum;

export interface TrackListItemProps {
  index: number;
  track: SimplifiedTrack;
  onPlay: () => void;
  isCurrent: boolean;
  isPlaying: boolean;
}

export interface AudioPlayerProps {
  track: SimplifiedTrack | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  enableClose: boolean;
}

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}
