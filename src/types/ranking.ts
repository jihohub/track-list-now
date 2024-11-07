export type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

export type RankingType = "artist" | "track";

export interface BaseRanking {
  rankingType: RankingCategory;
  count: number;
  updatedAt: Date;
}

export interface ArtistDetail {
  id: number;
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface TrackDetail {
  id: number;
  trackId: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

export interface ArtistWithRanking extends BaseRanking {
  artist: ArtistDetail;
}

export interface TrackWithRanking extends BaseRanking {
  track: TrackDetail;
}

export interface FeaturedRankingData {
  allTimeArtistsRanking: ArtistWithRanking[];
  allTimeTracksRanking: TrackWithRanking[];
  currentArtistsRanking: ArtistWithRanking[];
  currentTracksRanking: TrackWithRanking[];
}

export interface RankingSectionProps {
  title: string;
  data: ArtistWithRanking[] | TrackWithRanking[];
  type: RankingType;
  category: RankingCategory;
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

export interface ArtistTItemProps {
  index: number;
  item: ArtistWithRanking;
  type: "artist";
  isFeatured?: boolean;
}

export interface TrackTItemProps {
  index: number;
  item: TrackWithRanking;
  type: "track";
  isFeatured?: boolean;
}

export type TItemData = ArtistWithRanking | TrackWithRanking;
export type TItemProps = ArtistTItemProps | TrackTItemProps;

export type RankingDataMap = {
  [K in RankingCategory]: K extends `${string}ARTIST`
    ? ArtistWithRanking[]
    : TrackWithRanking[];
};

export const getRankingDataByCategory = <T extends RankingCategory>(
  data: FeaturedRankingData,
  category: T,
): T extends `${string}ARTIST` ? ArtistWithRanking[] : TrackWithRanking[] => {
  const dataMap = {
    ALL_TIME_ARTIST: data.allTimeArtistsRanking,
    ALL_TIME_TRACK: data.allTimeTracksRanking,
    CURRENT_ARTIST: data.currentArtistsRanking,
    CURRENT_TRACK: data.currentTracksRanking,
  };

  return dataMap[category] as T extends `${string}ARTIST`
    ? ArtistWithRanking[]
    : TrackWithRanking[];
};

export const RANKING_TYPE_MAP: Record<RankingCategory, RankingType> = {
  ALL_TIME_ARTIST: "artist",
  CURRENT_ARTIST: "artist",
  ALL_TIME_TRACK: "track",
  CURRENT_TRACK: "track",
};
