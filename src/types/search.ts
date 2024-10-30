import { SpotifyArtist } from "./artist";
import { SpotifyTrack } from "./track";

// **Simplified Artist and Track Interfaces**
export interface SimplifiedArtist {
  id: string;
  name: string;
  image_url: string;
  followers: number;
}

export interface SimplifiedTrack {
  id: string;
  name: string;
  album_image_url: string;
  artists: string;
  popularity: number;
}

export interface SimplifiedAlbum {
  id: string;
  name: string;
  album_image_url: string;
  artists: string;
  release_date: string;
}

// **Search Response Interfaces**
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

// **Error Response Interface**
export interface ErrorResponse {
  error: string;
}

// **Union Type for API Response**
export type ResponseData = SimplifiedSearchResponse | ErrorResponse;

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

// **Added Item Interfaces**
export interface AddedArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface AddedTrack {
  trackId: string;
  name: string;
  albumImageUrl: string;
  artists: string;
  popularity: number;
}

export type AddedItem = AddedArtist | AddedTrack;

// **Type Guards**
export const isAddedArtist = (item: AddedItem): item is AddedArtist => {
  return (item as AddedArtist).artistId !== undefined;
};

export const isAddedTrack = (item: AddedItem): item is AddedTrack => {
  return (item as AddedTrack).trackId !== undefined;
};

// **Spotify Search Response Interfaces**
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
