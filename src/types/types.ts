export interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers?: { total: number };
}

export interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export interface SearchResult {
  artists?: Artist[];
  tracks?: Track[];
}

export interface UserFavorite {
  userId: number;
  favoriteType: "atfArtists" | "atfTracks" | "cfArtists" | "cfTracks";
  artistId?: string;
  trackId?: string;
}

export interface RankingSectionProps {
  title: string;
  data: (Artist & { count: number })[] | (Track & { count: number })[];
  type: "artist" | "track";
  category: string;
}

export interface FavoriteSectionProps {
  title: string;
  items: Artist[] | Track[];
  openModal: () => void;
  type: "artist" | "track";
  isEditing: boolean;
  handleDelete: (id: string) => void;
}

export interface SearchModalProps {
  closeModal: () => void;
  modalType: "artist" | "track";
  activeSection: string;
  handleAddItem: (section: string, item: Artist | Track) => void;
}

export interface RankingItemType {
  name: string;
  imageUrl: string;
  followers?: number;
  popularity?: number;
  artists?: string | null;
  count: number;
}

export interface RankingItemProps {
  index: number;
  item: RankingItemType;
  type: "artist" | "track";
  category: string;
}

export interface ArtistOrTrackImageProps {
  imageUrl?: string;
  type: "artist" | "track";
  alt: string;
  size?: string;
  className?: string;
  isEditing?: boolean;
}
