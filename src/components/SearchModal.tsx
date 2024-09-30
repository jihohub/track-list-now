import { useState } from "react";

const SearchModal = ({
  closeModal,
  modalType, // artist or track
  activeSection,
  handleAddItem, // 아이템을 추가하는 함수
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setHasSearched(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}&type=${modalType}`
      );
      const data = await response.json();

      if (modalType === "artist" && data.artists) {
        setSearchResults(data.artists.items);
      } else if (modalType === "track" && data.tracks) {
        setSearchResults(data.tracks.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleSelectItem = (item) => {
    handleAddItem(activeSection, item); // 추가 기능을 처리하는 함수 호출
    closeModal();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          Search for {modalType === "artist" ? "Artists" : "Tracks"}
        </h2>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress} // Enter키를 누르면 검색 실행
            placeholder={`Search for ${
              modalType === "artist" ? "artists" : "tracks"
            }`}
            className="border p-2 pr-16 w-full rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full bg-blue-600 text-white px-4 rounded-r-lg"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className="mt-4 max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
              >
                <div className="flex items-center">
                  {/* 노래일 경우 앨범 이미지 표시 */}
                  {modalType === "track" &&
                    result.album &&
                    result.album.images &&
                    result.album.images[0] && (
                      <img
                        className="w-10 h-10 mr-4 rounded-lg"
                        src={result.album.images[0].url}
                        alt={result.name}
                      />
                    )}
                  {/* 아티스트일 경우 아티스트 이미지 표시 */}
                  {modalType === "artist" &&
                    result.images &&
                    result.images[0] && (
                      <img
                        className="w-10 h-10 mr-4 rounded-full"
                        src={result.images[0].url}
                        alt={result.name}
                      />
                    )}
                  <div className="flex flex-col">
                    <span>{result.name}</span>
                    {/* 노래일 경우 가수명 표시 */}
                    {modalType === "track" && result.artists && (
                      <span className="text-gray-400 text-xs">
                        {result.artists.map((artist) => artist.name).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSelectItem(result)}
                  className="bg-green-500 text-white px-2 py-1 rounded-lg ml-4"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}

        {hasSearched && searchResults.length === 0 && (
          <p className="mt-4 text-sm text-white">No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
