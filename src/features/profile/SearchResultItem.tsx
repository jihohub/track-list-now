import TImage from "@/features/common/TImage";
import { SimplifiedArtist, SimplifiedTrack } from "@/types/search";

interface SearchResultItemProps {
  result: SimplifiedArtist | SimplifiedTrack;
  modalType: "artist" | "track";
  handleSelectItem: (item: SimplifiedArtist | SimplifiedTrack) => void;
  addButtonLabel: string;
}

const SearchResultItem = ({
  result,
  modalType,
  handleSelectItem,
  addButtonLabel,
}: SearchResultItemProps) => {
  return (
    <li className="flex items-center justify-between text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
      <div className="flex items-center">
        <TImage
          imageUrl={
            modalType === "artist"
              ? (result as SimplifiedArtist).imageUrl
              : (result as SimplifiedTrack).albumImageUrl
          }
          type={modalType}
          alt={result.name}
          size="w-10 h-10"
          className="mr-4"
        />
        <div className="flex flex-col">
          <span>{result.name}</span>
          {modalType === "track" && "artists" in result && (
            <span className="text-gray-400 text-xs">
              {(result as SimplifiedTrack).artists}
            </span>
          )}
        </div>
      </div>
      <div className="min-w-[60px]">
        <button
          onClick={() => handleSelectItem(result)}
          className="bg-green-500 text-white px-2 py-1 rounded-lg ml-4"
          type="button"
        >
          {addButtonLabel}
        </button>
      </div>
    </li>
  );
};

export default SearchResultItem;
