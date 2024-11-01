// 랭킹 카테고리 타입
export type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

// 기본 랭킹 인터페이스
export interface BaseRanking {
  rankingType: RankingCategory;
  count: number;
  updatedAt: Date;
}

// 아티스트 상세 정보
export interface ArtistDetail {
  id: number;
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

// 트랙 상세 정보
export interface TrackDetail {
  id: number;
  trackId: string;
  name: string;
  imageUrl: string;
  artists: string;
  popularity: number;
}

// 아티스트 랭킹 타입
export interface ArtistWithRanking extends BaseRanking {
  artist: ArtistDetail;
}

// 트랙 랭킹 타입
export interface TrackWithRanking extends BaseRanking {
  track: TrackDetail;
}

// 전체 랭킹 데이터 타입
export interface FullRankingData {
  allTimeArtistsRanking: ArtistWithRanking[];
  allTimeTracksRanking: TrackWithRanking[];
  currentArtistsRanking: ArtistWithRanking[];
  currentTracksRanking: TrackWithRanking[];
}

// 랭킹 섹션 컴포넌트의 props 타입
export interface RankingSectionProps {
  title: string;
  data: ArtistWithRanking[] | TrackWithRanking[];
  type: "artist" | "track";
  category: RankingCategory;
}

// 타입 가드 함수
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

// TItemProps 타입 정의
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
