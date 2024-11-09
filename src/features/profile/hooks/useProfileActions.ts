import { addFavorite, deleteFavorite } from "@/libs/utils/profileActions";
import { SectionToItemType, UserFavorites } from "@/types/favorite";
import { useState } from "react";

interface UseProfileActionsProps {
  editedFavorites: UserFavorites | null;
  setEditedFavorites: (favorites: UserFavorites | null) => void;
}

interface ModalState {
  isOpen: boolean;
  type?: "artist" | "track";
  section?: keyof UserFavorites;
}

const useProfileActions = ({
  editedFavorites,
  setEditedFavorites,
}: UseProfileActionsProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
  });

  const openModal = (
    type: "artist" | "track",
    section: keyof UserFavorites,
  ) => {
    setModalState({
      isOpen: true,
      type,
      section,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
    });
  };

  const handleDelete = <S extends keyof UserFavorites>(
    section: S,
    id: string,
  ) => {
    if (!editedFavorites) return;

    const updatedFavorites = deleteFavorite(section, id, editedFavorites);
    setEditedFavorites(updatedFavorites);
  };

  const handleAddItem = <S extends keyof UserFavorites>(
    section: S,
    item: SectionToItemType<S>,
  ) => {
    if (!editedFavorites) return;

    const updatedFavorites = addFavorite(section, item, editedFavorites);
    setEditedFavorites(updatedFavorites);
  };

  return {
    isModalOpen: modalState.isOpen,
    modalType: modalState.type,
    activeSection: modalState.section,
    openModal,
    closeModal,
    handleDelete,
    handleAddItem,
  };
};

export default useProfileActions;
