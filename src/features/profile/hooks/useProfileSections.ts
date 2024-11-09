import { UserFavorites } from "@/types/favorite";
import { SectionConfig } from "@/types/section";
import { useTranslation } from "next-i18next";

const useProfileSections = (
  displayFavorites: UserFavorites | null | undefined,
  openModal: (type: "artist" | "track", section: keyof UserFavorites) => void,
  handleDelete: (section: keyof UserFavorites, id: string) => void,
) => {
  const { t } = useTranslation("common");

  const artistSections: SectionConfig[] = [
    {
      title: t("all_time_favorite_artists"),
      items: displayFavorites?.allTimeArtists ?? [],
      type: "artist",
      openModal: () => openModal("artist", "allTimeArtists"),
      handleDelete: (id: string) => handleDelete("allTimeArtists", id),
    },
    {
      title: t("current_favorite_artists"),
      items: displayFavorites?.currentArtists ?? [],
      type: "artist",
      openModal: () => openModal("artist", "currentArtists"),
      handleDelete: (id: string) => handleDelete("currentArtists", id),
    },
  ];

  const trackSections: SectionConfig[] = [
    {
      title: t("all_time_favorite_tracks"),
      items: displayFavorites?.allTimeTracks ?? [],
      type: "track",
      openModal: () => openModal("track", "allTimeTracks"),
      handleDelete: (id: string) => handleDelete("allTimeTracks", id),
    },
    {
      title: t("current_favorite_tracks"),
      items: displayFavorites?.currentTracks ?? [],
      type: "track",
      openModal: () => openModal("track", "currentTracks"),
      handleDelete: (id: string) => handleDelete("currentTracks", id),
    },
  ];

  return [...artistSections, ...trackSections];
};

export default useProfileSections;
