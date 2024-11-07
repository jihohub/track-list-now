import { SpotifyArtist } from "./artist";
import { SpotifyTrack } from "./track";

export interface SimplifiedArtist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface SimplifiedTrack {
  id: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

export interface SimplifiedAlbum {
  id: string;
  name: string;
  imageUrl: string;
  artists: string;
  releaseDate: string;
}

export interface ArtistsSearchResponse {
  artists: {
    items: SimplifiedArtist[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface TracksSearchResponse {
  tracks: {
    items: SimplifiedTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export type SimplifiedSearchResponse =
  | ArtistsSearchResponse
  | TracksSearchResponse;

export type SearchResult = SimplifiedArtist | SimplifiedTrack | SimplifiedAlbum;

export interface SearchResponseData {
  artists?: {
    items: SimplifiedArtist[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  tracks?: {
    items: SimplifiedTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  albums?: {
    items: SimplifiedAlbum[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface AddedArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface AddedTrack {
  trackId: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

export type AddedItem = AddedArtist | AddedTrack;

export const isAddedArtist = (item: AddedItem): item is AddedArtist => {
  return (item as AddedArtist).artistId !== undefined;
};

export const isAddedTrack = (item: AddedItem): item is AddedTrack => {
  return (item as AddedTrack).trackId !== undefined;
};

export interface SpotifyArtistSearchResponse {
  artists: {
    items: SpotifyArtist[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface SpotifyTrackSearchResponse {
  tracks: {
    items: SpotifyTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface SpotifyAlbumSearchResponse {
  albums: {
    items: SpotifyTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export type SpotifySearchResponse =
  | SpotifyArtistSearchResponse
  | SpotifyTrackSearchResponse
  | SpotifyAlbumSearchResponse;
