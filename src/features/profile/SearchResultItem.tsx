import TImage from "@/features/common/TImage";
import { UserFavorites } from "@/types/favorite";
import { SimplifiedArtist, SimplifiedTrack } from "@/types/search";

interface SearchResultItemProps {
  result: SimplifiedArtist | SimplifiedTrack;
  modalType: "artist" | "track";
  handleSelectItem: (item: SimplifiedArtist | SimplifiedTrack) => void;
  addButtonLabel: string;
  userFavorites: UserFavorites;
}

const SearchResultItem = ({
  result,
  modalType,
  handleSelectItem,
  addButtonLabel,
  userFavorites,
}: SearchResultItemProps) => {
  const isArtist = modalType === "artist";
  const isTrack = modalType === "track";

  const exists = isArtist
    ? userFavorites.allTimeArtists.some(
        (artist) => artist.artistId === (result as SimplifiedArtist).id,
      ) ||
      userFavorites.currentArtists.some(
        (artist) => artist.artistId === (result as SimplifiedArtist).id,
      )
    : userFavorites.allTimeTracks.some(
        (track) => track.trackId === (result as SimplifiedTrack).id,
      ) ||
      userFavorites.currentTracks.some(
        (track) => track.trackId === (result as SimplifiedTrack).id,
      );

  return (
    <li className="flex items-center justify-between text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
      <div className="flex items-center">
        <TImage
          imageUrl={
            modalType === "artist"
              ? (result as SimplifiedArtist).imageUrl
              : (result as SimplifiedTrack).imageUrl
          }
          type={modalType}
          alt={result.name}
          size="w-10 h-10"
          className="mr-4"
        />
        <div className="flex flex-col">
          <span>{result.name}</span>
          {isTrack && "artists" in result && (
            <span className="text-gray-400 text-xs">
              {(result as SimplifiedTrack).artists}
            </span>
          )}
        </div>
      </div>
      <div className="min-w-[60px]">
        {!exists && (
          <button
            onClick={() => handleSelectItem(result)}
            className={`px-2 py-1 rounded-lg ml-4 ${
              exists
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white"
            }`}
            type="button"
            disabled={exists}
          >
            {addButtonLabel}
          </button>
        )}
      </div>
    </li>
  );
};

export default SearchResultItem;
