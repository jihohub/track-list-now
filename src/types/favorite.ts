import { Artist, Track } from "@prisma/client";

export interface UserFavoriteArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface UserFavoriteTrack {
  trackId: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

export interface UserFavorites {
  allTimeArtists: UserFavoriteArtist[];
  allTimeTracks: UserFavoriteTrack[];
  currentArtists: UserFavoriteArtist[];
  currentTracks: UserFavoriteTrack[];
}

export interface FavoriteSectionProps {
  title: string;
  items: UserFavoriteArtist[] | UserFavoriteTrack[];
  openModal: () => void;
  type: "artist" | "track";
  isEditing: boolean;
  handleDelete: (id: string) => void;
}

export interface FavoriteItemProps {
  item: UserFavoriteArtist | UserFavoriteTrack;
  type: "artist" | "track";
  isEditing: boolean;
  handleDelete: (id: string) => void;
}

export type SectionToItemType<S extends keyof UserFavorites> = S extends
  | "allTimeArtists"
  | "currentArtists"
  ? UserFavoriteArtist
  : S extends "allTimeTracks" | "currentTracks"
    ? UserFavoriteTrack
    : never;

// 섹션별 타입 가드
export const isUserFavoriteArtist = (
  item: UserFavoriteArtist | UserFavoriteTrack,
): item is UserFavoriteArtist => {
  return (item as UserFavoriteArtist).artistId !== undefined;
};

export const isUserFavoriteTrack = (
  item: UserFavoriteArtist | UserFavoriteTrack,
): item is UserFavoriteTrack => {
  return (item as UserFavoriteTrack).trackId !== undefined;
};

// 섹션별 타입 가드 함수
export const isArtistSection = (
  section: keyof UserFavorites,
): section is "allTimeArtists" | "currentArtists" => {
  return section === "allTimeArtists" || section === "currentArtists";
};

export const isTrackSection = (
  section: keyof UserFavorites,
): section is "allTimeTracks" | "currentTracks" => {
  return section === "allTimeTracks" || section === "currentTracks";
};

export interface UserFavoritesResponse {
  allTimeArtists: Artist[];
  currentArtists: Artist[];
  allTimeTracks: Track[];
  currentTracks: Track[];
}

export type ResponseData =
  | UserFavoritesResponse
  | { message: string }
  | { error: string };

export interface UserFavoriteArtistInput {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface UserFavoriteTrackInput {
  trackId: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

export interface UpdateFavorites {
  userId: number;
  allTimeArtists: UserFavoriteArtistInput[];
  allTimeTracks: UserFavoriteTrackInput[];
  currentArtists: UserFavoriteArtistInput[];
  currentTracks: UserFavoriteTrackInput[];
}
