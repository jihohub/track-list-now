import EditControls from "@/features/profile/components/EditControls";
import FavoriteSections from "@/features/profile/components/FavoriteSections";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SearchModal from "@/features/profile/components/SearchModal";
import { SectionToItemType, UserFavorites } from "@/types/favorite";
import { SectionConfig } from "@/types/section";
import { useTranslation } from "next-i18next";
import { RefObject } from "react";

interface ProfileSectionProps {
  viewedUserName?: string;
  profileImageUrl?: string | null;
  isLoading: boolean;
  isEditing: boolean;
  editedFavorites: UserFavorites | null;
  sections: SectionConfig[];
  pageRef: RefObject<HTMLDivElement>;
  isModalOpen: boolean;
  modalType?: "artist" | "track" | null;
  activeSection?: string | null;
  handleToggleEditing: () => void;
  handleSaveChanges: () => Promise<void>;
  closeModal: () => void;
  handleAddItem: <S extends keyof UserFavorites>(
    section: S,
    item: SectionToItemType<S>,
  ) => void;
}

const ProfileSection = ({
  viewedUserName,
  profileImageUrl,
  isLoading,
  isEditing,
  editedFavorites,
  sections,
  pageRef,
  isModalOpen,
  modalType,
  activeSection,
  handleToggleEditing,
  handleSaveChanges,
  closeModal,
  handleAddItem,
}: ProfileSectionProps) => {
  const { t } = useTranslation(["common", "profile", "error"]);

  return (
    <div>
      <div ref={pageRef}>
        <ProfileHeader
          viewedUserName={viewedUserName}
          profileImageUrl={profileImageUrl}
          isLoading={isLoading}
        />

        <EditControls
          label={
            isEditing
              ? t("save", { ns: "profile" })
              : t("edit", { ns: "profile" })
          }
          isEditing={isEditing}
          toggleEditing={handleToggleEditing}
          handleSaveChanges={handleSaveChanges}
        />

        <FavoriteSections
          sections={sections}
          isEditing={isEditing}
          isLoading={isLoading}
        />

        {isModalOpen && modalType && activeSection && (
          <SearchModal
            closeModal={closeModal}
            modalType={modalType}
            activeSection={activeSection}
            handleAddItem={(section, item) => {
              handleAddItem(section as keyof UserFavorites, item);
            }}
            userFavorites={editedFavorites as UserFavorites}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
