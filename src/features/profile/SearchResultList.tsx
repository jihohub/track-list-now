import { UserFavorites } from "@/types/favorite";
import { SimplifiedArtist, SimplifiedTrack } from "@/types/search";
import SearchResultItem from "./SearchResultItem";

interface SearchResultListProps {
  searchResults: SimplifiedArtist[] | SimplifiedTrack[];
  modalType: "artist" | "track";
  handleSelectItem: (item: SimplifiedArtist | SimplifiedTrack) => void;
  addButtonLabel: string;
  userFavorites: UserFavorites;
}

const SearchResultList = ({
  searchResults,
  modalType,
  handleSelectItem,
  addButtonLabel,
  userFavorites,
}: SearchResultListProps) => {
  return (
    <ul className="mt-4 max-h-48 overflow-y-auto">
      {searchResults.map((result) => (
        <SearchResultItem
          key={result.id}
          result={result}
          modalType={modalType}
          handleSelectItem={handleSelectItem}
          addButtonLabel={addButtonLabel}
          userFavorites={userFavorites}
        />
      ))}
    </ul>
  );
};

export default SearchResultList;
