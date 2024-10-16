import LoadingBar from "@/features/common/LoadingBar";
import TImage from "@/features/common/TImage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface SimplifiedArtist {
  imageUrl: string;
  name: string;
  id: string;
  followers: number;
}

interface SimplifiedTrack {
  albumImageUrl: string;
  name: string;
  artists: string;
  id: string;
  popularity: number;
}

type SimplifiedSearchResponse =
  | {
      artists: {
        items: SimplifiedArtist[];
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
      };
    }
  | {
      tracks: {
        items: SimplifiedTrack[];
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
      };
    };

interface ErrorResponse {
  error: string;
}

type ResponseData = SimplifiedSearchResponse | ErrorResponse;

interface AddedArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface AddedTrack {
  trackId: string;
  name: string;
  albumImageUrl: string;
  artists: string;
  popularity: number;
}

type AddedItem = AddedArtist | AddedTrack;

interface SearchModalProps {
  closeModal: () => void;
  modalType: "artist" | "track";
  activeSection: string;
  handleAddItem: (section: string, item: AddedItem) => void;
}

const SearchModal = ({
  closeModal,
  modalType,
  activeSection,
  handleAddItem,
}: SearchModalProps) => {
  const { t } = useTranslation(["common", "profile"]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{
    q: string;
    type: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const resultsRef = useRef<HTMLUListElement>(null);

  const queryKey = searchParams
    ? ["search", searchParams.q, searchParams.type]
    : [];

  const { data, isLoading } = useQuery<ResponseData, Error>({
    queryKey,
    queryFn: () =>
      axios
        .get<ResponseData>("/api/search", {
          params: searchParams,
        })
        .then((res) => res.data),
    enabled: !!searchParams,
    retry: false,
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    setSearchParams({ q: searchQuery.trim(), type: modalType });
  };

  const handleSelectItem = (item: SimplifiedArtist | SimplifiedTrack) => {
    if (modalType === "artist" && "followers" in item) {
      const addedArtist: AddedArtist = {
        artistId: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        followers: item.followers,
      };

      handleAddItem(activeSection, addedArtist);
    } else if (modalType === "track" && "albumImageUrl" in item) {
      const addedTrack: AddedTrack = {
        trackId: item.id,
        name: item.name,
        albumImageUrl: item.albumImageUrl,
        artists: item.artists,
        popularity: item.popularity,
      };

      handleAddItem(activeSection, addedTrack);
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
  }, [data]);

  const target = getTargetLabel(modalType, router.locale || "ko");

  let searchResults: SimplifiedArtist[] | SimplifiedTrack[] = [];
  if (data) {
    if ("artists" in data) {
      searchResults = data.artists.items;
    } else if ("tracks" in data) {
      searchResults = data.tracks.items;
    }
  }

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

        {isLoading && <LoadingBar />}

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
                    {t("add", { ns: "profile" })}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {hasSearched && searchResults.length === 0 && !isLoading && (
          <p className="mt-4 text-sm text-white">
            {t("no_result", { ns: "profile" })}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
