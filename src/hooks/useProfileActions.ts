import { addFavorite, deleteFavorite } from "@/libs/utils/profileActions";
import { SectionToItemType, UserFavorites } from "@/types/favorite";
import { useState } from "react";

interface UseProfileActionsProps {
  editedFavorites: UserFavorites | null;
  setEditedFavorites: React.Dispatch<
    React.SetStateAction<UserFavorites | null>
  >;
}

const useProfileActions = ({
  editedFavorites,
  setEditedFavorites,
}: UseProfileActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"artist" | "track" | undefined>(
    undefined,
  );
  const [activeSection, setActiveSection] = useState<
    keyof UserFavorites | undefined
  >(undefined);

  const openModal = (
    type: "artist" | "track",
    section: keyof UserFavorites,
  ) => {
    setModalType(type);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(undefined);
    setActiveSection(undefined);
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
    isModalOpen,
    modalType,
    activeSection,
    openModal,
    closeModal,
    handleDelete,
    handleAddItem,
  };
};

export default useProfileActions;
