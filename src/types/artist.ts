import { Artist, ArtistRanking, Track, TrackRanking } from "@prisma/client";

export type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface SpotifyArtistBrief {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface SpotifyTrack {
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
    restrictions?: {
      reason: string;
    };
    type: "album";
    uri: string;
    artists: SpotifyArtistBrief[];
  };
  artists: SpotifyArtistBrief[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean?: string;
    upc?: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: unknown;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface SpotifyTopTracks {
  tracks: SpotifyTrack[];
}

export interface SpotifyRelatedArtists {
  artists: SpotifyArtist[];
}

export interface CombinedArtistData {
  artist: SpotifyArtist;
  topTracks: SpotifyTopTracks;
  relatedArtists: SpotifyRelatedArtists;
}

export type ArtistResponseData = CombinedArtistData;

export interface ArtistPageData {
  artist: {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    followers: {
      href: string | null;
      total: number;
    };
  };
  topTracks: {
    tracks: {
      id: string;
      name: string;
      album: { images: { url: string }[] };
      artists: { name: string }[];
    }[];
  };
  relatedArtists: {
    artists: {
      id: string;
      name: string;
      images: { url: string }[];
    }[];
  };
}

export interface ArtistWithRanking
  extends Omit<ArtistRanking, "updatedAt" | "rankingType"> {
  rankingType: RankingCategory;
  count: number;
  updatedAt: Date;
  artist: Artist;
}

export interface TrackWithRanking
  extends Omit<TrackRanking, "updatedAt" | "rankingType"> {
  rankingType: RankingCategory;
  count: number;
  updatedAt: Date;
  track: Track;
}

export const isArtistWithRanking = (
  item: ArtistWithRanking | TrackWithRanking,
): item is ArtistWithRanking => {
  return (item as ArtistWithRanking).artist !== undefined;
};

export const isTrackWithRanking = (
  item: ArtistWithRanking | TrackWithRanking,
): item is TrackWithRanking => {
  return (item as TrackWithRanking).track !== undefined;
};
