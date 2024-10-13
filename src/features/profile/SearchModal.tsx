import TImage from "@/features/common/TImage";
import spotifyApi from "@/libs/axios/axiosInstance";
import { SpotifyArtist, SpotifyTrack } from "@/types/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SearchModal = ({
  closeModal,
  modalType,
  activeSection,
  handleAddItem,
}) => {
  const { t } = useTranslation(["common", "profile"]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    (SpotifyArtist | SpotifyTrack)[]
  >([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const resultsRef = useRef<HTMLUListElement>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setHasSearched(true);
    try {
      const response = await spotifyApi.get("/search", {
        params: {
          q: searchQuery,
          type: modalType,
        },
      });

      const { data } = response;

      if (modalType === "artist" && data.artists) {
        setSearchResults(data.artists.items);
      } else if (modalType === "track" && data.tracks) {
        setSearchResults(data.tracks.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      // TODO: error 처리
      const errorMessage = error;
      JSON.stringify(errorMessage);
      setSearchResults([]);
    }
  };

  const handleSelectItem = (item: SpotifyArtist | SpotifyTrack) => {
    if (modalType === "artist") {
      handleAddItem(activeSection, {
        artistId: item.id,
        name: item.name,
        imageUrl: item.images[0]?.url || "/default-artist.png",
        followers: item.followers.total,
      });
    } else if (modalType === "track") {
      handleAddItem(activeSection, {
        trackId: item.id,
        name: item.name,
        albumImageUrl: item.album.images[0]?.url || "/default-artist.png",
        artists: item.artists.map((artist) => ({ name: artist.name })),
        popularity: item.popularity,
      });
    }

    closeModal();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getTargetLabel = (
    currentModalType: "artist" | "track",
    locale: string,
  ) => {
    if (currentModalType === "artist") {
      return locale === "en" ? "Artist" : "아티스트";
    }
    return locale === "en" ? "Track" : "곡";
  };

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [searchResults]);

  const target = getTargetLabel(modalType, router.locale);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
          type="button"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          {t("search_for", { target, ns: "profile" })}
        </h2>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("placeholder", { target, ns: "profile" })}
            className="border p-2 pr-16 w-full rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full bg-blue-600 text-white px-4 rounded-r-lg"
            type="button"
          >
            {t("search", { ns: "profile" })}
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul ref={resultsRef} className="mt-4 max-h-48 overflow-y-auto">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="flex items-center justify-between text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
              >
                <div className="flex items-center">
                  <TImage
                    imageUrl={
                      modalType === "artist"
                        ? result?.images?.[0]?.url
                        : result?.album?.images?.[0]?.url
                    }
                    type={modalType}
                    alt={result.name}
                    size="w-10 h-10"
                    className="mr-4"
                  />
                  <div className="flex flex-col">
                    <span>{result.name}</span>
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
                  type="button"
                >
                  {t("add", { ns: "profile" })}
                </button>
              </li>
            ))}
          </ul>
        )}

        {hasSearched && searchResults.length === 0 && (
          <p className="mt-4 text-sm text-white">
            {t("no_result", { ns: "profile" })}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
