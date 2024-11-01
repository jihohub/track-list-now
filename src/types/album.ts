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

// **Simplified Artist Interface**
export interface SimplifiedArtist {
  id: string;
  name: string;
}

// **Simplified Track Interface**
export interface SimplifiedTrack {
  id: string;
  name: string;
  artists: SimplifiedArtist[];
  previewUrl: string | null;
  durationMs: number;
  imageUrl: string;
}

// **Simplified Tracks Interface within Album**
export interface SimplifiedTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SimplifiedTrack[];
}

// **Simplified Album Interface**
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

// **Error Response Interface**
export interface ErrorResponse {
  error: string;
}

// **Union Type for API Response**
export type AlbumResponseData = SimplifiedAlbum | ErrorResponse;

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
  isAlbumPage: boolean;
}

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}
