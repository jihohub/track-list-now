import FavoriteSection from "@/features/profile/components/FavoriteSection";
import FavoriteSectionSkeleton from "@/features/profile/components/FavoriteSectionSkeleton";
import { SectionConfig } from "@/types/section";

interface FavoriteSectionsProps {
  sections: SectionConfig[];
  isEditing: boolean;
  isLoading?: boolean;
}

const FavoriteSections = ({
  sections,
  isEditing,
  isLoading = false,
}: FavoriteSectionsProps) => {
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
          {...section}
          isEditing={isEditing}
        />
      ))}
    </div>
  );
};

export default FavoriteSections;
