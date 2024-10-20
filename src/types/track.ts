// **Spotify API Response Interfaces**
export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyRestrictions {
  reason: string;
}

export interface SpotifyArtistBrief {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface SpotifyExternalIds {
  isrc: string;
  ean?: string;
  upc?: string;
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictions;
  type: "album";
  uri: string;
  artists: SpotifyArtistBrief[];
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtistBrief[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object | null;
  restrictions?: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export type SuccessResponse = SpotifyTrack;

export interface ErrorResponse {
  error: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

// **Frontend Page Interfaces**
export interface TrackDetail {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
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
    restrictions: {
      reason: string;
    };
    type: string;
    uri: string;
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
  };
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }>;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object | null;
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

// **Extended Interfaces for React Query**
export interface TrackWithRanking {
  rankingType: string; // 예: "TOP_TRACKS"
  count: number;
  updatedAt: Date;
  track: TrackDetail;
}

export type TItemData = TrackWithRanking | TrackDetail;

// **Type Guards**
export const isTrackWithRanking = (
  item: TItemData,
): item is TrackWithRanking => {
  return (
    (item as TrackWithRanking).track !== undefined &&
    (item as TrackWithRanking).count !== undefined
  );
};
