export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
}

export interface Track {
  id: string;
  name: string;
  albumImageUrl: string;
  artistNames: string;
  popularity: number;
}

export interface ArtistRanking {
  id: number;
  artistId: string;
  rankingType: "ALL_TIME_ARTIST" | "CURRENT_ARTIST";
  count: number;
  followers: number;
  updatedAt: string;
}

export interface TrackRanking {
  id: number;
  trackId: string;
  rankingType: "ALL_TIME_TRACK" | "CURRENT_TRACK";
  count: number;
  popularity: number;
  updatedAt: string;
}

export interface FullRankingData {
  allTimeArtistsRanking: ArtistRanking[];
  allTimeTracksRanking: TrackRanking[];
  currentArtistsRanking: ArtistRanking[];
  currentTracksRanking: TrackRanking[];
}

export interface RankedArtist extends Artist {
  count: number;
}

export interface RankedTrack extends Track {
  count: number;
}

export interface RankingData {
  allTimeArtists: RankedArtist[];
  allTimeTracks: RankedTrack[];
  currentArtists: RankedArtist[];
  currentTracks: RankedTrack[];
}

export interface UserFavoriteArtist {
  id: string;
  userId: number;
  artistId: string;
  favoriteType: "ALL_TIME_ARTIST" | "CURRENT_ARTIST";
  artist: Artist;
}

export interface UserFavoriteTrack {
  id: string;
  userId: number;
  trackId: string;
  favoriteType: "ALL_TIME_TRACK" | "CURRENT_TRACK";
  track: Track;
}

export interface UserFavoritesResponse {
  favoriteArtists: UserFavoriteArtist[];
  favoriteTracks: UserFavoriteTrack[];
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  followers?: { total: number };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export interface SearchResult {
  artists?: SpotifyArtist[];
  tracks?: SpotifyTrack[];
}
export interface RankingSectionProps {
  title: string;
  data: RankedArtist[] | RankedTrack[];
  type: "artist" | "track";
  category: string;
}

export interface FavoriteSectionProps {
  title: string;
  items: SpotifyArtist[] | SpotifyTrack[];
  openModal: () => void;
  type: "artist" | "track";
  isEditing: boolean;
  handleDelete: (id: string) => void;
}

export interface SearchModalProps {
  closeModal: () => void;
  modalType: "artist" | "track";
  activeSection: string;
  handleAddItem: (section: string, item: SpotifyArtist | SpotifyTrack) => void;
}

export interface RankingItemProps {
  index: number;
  item: Artist | Track;
  type: "artist" | "track";
  isFeatured?: boolean;
}

export interface ArtistOrTrackImageProps {
  imageUrl?: string;
  type: "artist" | "track";
  alt: string;
  size?: string;
  className?: string;
  isEditing?: boolean;
}

export interface ArtistDetail {
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
  type: string;
  uri: string;
}

// 트랙 상세 정보 타입
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
