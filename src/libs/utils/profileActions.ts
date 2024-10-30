import {
  isArtistSection,
  isTrackSection,
  SectionToItemType,
  UserFavoriteArtist,
  UserFavorites,
  UserFavoriteTrack,
} from "@/types/favorite";

export const deleteFavorite = <S extends keyof UserFavorites>(
  section: S,
  id: string,
  favorites: UserFavorites,
): UserFavorites => {
  const updatedFavorites: UserFavorites = { ...favorites };

  if (isArtistSection(section)) {
    updatedFavorites[section] = updatedFavorites[section].filter(
      (item) => item.artistId !== id,
    );
  } else if (isTrackSection(section)) {
    updatedFavorites[section] = updatedFavorites[section].filter(
      (item) => item.trackId !== id,
    );
  }

  return updatedFavorites;
};

export const addFavorite = <S extends keyof UserFavorites>(
  section: S,
  item: SectionToItemType<S>,
  favorites: UserFavorites,
): UserFavorites => {
  const updatedFavorites: UserFavorites = { ...favorites };

  if (isArtistSection(section)) {
    const exists = (updatedFavorites[section] as UserFavoriteArtist[]).some(
      (artist) => artist.artistId === (item as UserFavoriteArtist).artistId,
    );
    if (!exists) {
      updatedFavorites[section] = [
        ...(updatedFavorites[section] as UserFavoriteArtist[]),
        item as UserFavoriteArtist,
      ];
    }
  } else if (isTrackSection(section)) {
    const exists = (updatedFavorites[section] as UserFavoriteTrack[]).some(
      (track) => track.trackId === (item as UserFavoriteTrack).trackId,
    );
    if (!exists) {
      updatedFavorites[section] = [
        ...(updatedFavorites[section] as UserFavoriteTrack[]),
        item as UserFavoriteTrack,
      ];
    }
  }

  return updatedFavorites;
};
