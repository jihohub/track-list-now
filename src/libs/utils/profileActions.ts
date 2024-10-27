import {
  isArtistSection,
  isTrackSection,
  SectionToItemType,
  UserFavorites,
} from "@/types/favorite";

export const deleteFavorite = <S extends keyof UserFavorites>(
  section: S,
  id: string,
  favorites: UserFavorites,
): UserFavorites => {
  const updatedFavorites: UserFavorites = { ...favorites };

  if (isArtistSection(section)) {
    updatedFavorites[section] = (updatedFavorites[section] as any[]).filter(
      (item: any) => item.artistId !== id,
    );
  } else if (isTrackSection(section)) {
    updatedFavorites[section] = (updatedFavorites[section] as any[]).filter(
      (item: any) => item.trackId !== id,
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
    updatedFavorites[section] = [...(updatedFavorites[section] as any[]), item];
  } else if (isTrackSection(section)) {
    updatedFavorites[section] = [...(updatedFavorites[section] as any[]), item];
  }

  return updatedFavorites;
};
