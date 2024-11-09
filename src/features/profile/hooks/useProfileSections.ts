import { UserFavorites } from "@/types/favorite";
import { useTranslation } from "next-i18next";

const useProfileSections = (
  displayFavorites: UserFavorites | null,
  openModal: (type: "artist" | "track", section: string) => void,
  handleDelete: (section: string, id: string) => void,
) => {
  const { t } = useTranslation("common");

  return [
    {
      title: t("all_time_favorite_artists"),
      items: displayFavorites?.allTimeArtists || [],
      type: "artist" as const,
      openModal: () => openModal("artist", "allTimeArtists"),
      handleDelete: (id: string) => handleDelete("allTimeArtists", id),
    },
    {
      title: t("all_time_favorite_tracks"),
      items: displayFavorites?.allTimeTracks || [],
      type: "track" as const,
      openModal: () => openModal("track", "allTimeTracks"),
      handleDelete: (id: string) => handleDelete("allTimeTracks", id),
    },
    {
      title: t("current_favorite_artists"),
      items: displayFavorites?.currentArtists || [],
      type: "artist" as const,
      openModal: () => openModal("artist", "currentArtists"),
      handleDelete: (id: string) => handleDelete("currentArtists", id),
    },
    {
      title: t("current_favorite_tracks"),
      items: displayFavorites?.currentTracks || [],
      type: "track" as const,
      openModal: () => openModal("track", "currentTracks"),
      handleDelete: (id: string) => handleDelete("currentTracks", id),
    },
  ];
};

export default useProfileSections;
