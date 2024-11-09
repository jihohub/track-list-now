import {
  UserFavoriteArtist,
  UserFavoriteTrack,
  UserFavorites,
} from "@/types/favorite";

export interface BaseSection {
  title: string;
  type: "artist" | "track";
  openModal: () => void;
  handleDelete: (id: string) => void;
}

export interface ArtistSection extends BaseSection {
  type: "artist";
  items: UserFavoriteArtist[];
}

export interface TrackSection extends BaseSection {
  type: "track";
  items: UserFavoriteTrack[];
}

export type SectionConfig = ArtistSection | TrackSection;

export interface ProfileSectionProps {
  viewedUserName?: string;
  profileImageUrl?: string | null;
  isLoading: boolean;
  isEditing: boolean;
  editedFavorites: UserFavorites | null;
  sections: SectionConfig[];
  isModalOpen: boolean;
  modalType?: "artist" | "track" | null;
  activeSection?: string | null;
  handleToggleEditing: () => void;
  handleSaveChanges: () => Promise<void>;
  closeModal: () => void;
  handleAddItem: (
    section: keyof UserFavorites,
    item: UserFavoriteArtist | UserFavoriteTrack,
  ) => void;
}
