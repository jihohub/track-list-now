import FavoriteSection from "@/features/profile/components/FavoriteSection";
import FavoriteSectionSkeleton from "@/features/profile/components/FavoriteSectionSkeleton";
import { UserFavorites } from "@/types/favorite";

interface SectionConfig {
  title: string;
  items: UserFavorites[keyof UserFavorites];
  type: "artist" | "track";
  openModal: () => void;
  handleDelete: (id: string) => void;
}

interface FavoriteSectionsProps {
  sections: SectionConfig[];
  isEditing: boolean;
  isLoading?: boolean;
}

const FavoriteSections: React.FC<FavoriteSectionsProps> = ({
  sections,
  isEditing,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FavoriteSectionSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {sections.map((section) => (
        <FavoriteSection
          key={section.title}
          title={section.title}
          items={section.items}
          openModal={section.openModal}
          type={section.type}
          isEditing={isEditing}
          handleDelete={section.handleDelete}
        />
      ))}
    </div>
  );
};

export default FavoriteSections;
