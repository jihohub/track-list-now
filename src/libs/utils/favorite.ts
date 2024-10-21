import {
  ArtistRankingType,
  FavoriteType,
  TrackRankingType,
} from "@prisma/client";

// FavoriteType을 ArtistRankingType으로 매핑하는 함수
export const mapFavoriteTypeToArtistRankingType = (
  favoriteType: FavoriteType,
): ArtistRankingType => {
  switch (favoriteType) {
    case FavoriteType.ALL_TIME_ARTIST:
      return ArtistRankingType.ALL_TIME_ARTIST;
    case FavoriteType.CURRENT_ARTIST:
      return ArtistRankingType.CURRENT_ARTIST;
    default:
      throw new Error(
        `Invalid favoriteType for ArtistRankingType: ${favoriteType}`,
      );
  }
};

// FavoriteType을 TrackRankingType으로 매핑하는 함수
export const mapFavoriteTypeToTrackRankingType = (
  favoriteType: FavoriteType,
): TrackRankingType => {
  switch (favoriteType) {
    case FavoriteType.ALL_TIME_TRACK:
      return TrackRankingType.ALL_TIME_TRACK;
    case FavoriteType.CURRENT_TRACK:
      return TrackRankingType.CURRENT_TRACK;
    default:
      throw new Error(
        `Invalid favoriteType for TrackRankingType: ${favoriteType}`,
      );
  }
};

// 기존 아이템과 새로운 아이템의 차이를 계산하는 함수
export const computeDifference = <ExistingItem, NewItem>(
  existing: ExistingItem[],
  newItems: NewItem[],
  keyExisting: keyof ExistingItem & string,
  keyNew: keyof NewItem & string,
): { toAdd: NewItem[]; toRemove: ExistingItem[] } => {
  const existingIds = new Set<string>(
    existing.map((item) => String(item[keyExisting])),
  );
  const newIds = new Set<string>(newItems.map((item) => String(item[keyNew])));
  const toAdd = newItems.filter(
    (item) => !existingIds.has(String(item[keyNew])),
  );
  const toRemove = existing.filter(
    (item) => !newIds.has(String(item[keyExisting])),
  );
  return { toAdd, toRemove };
};
