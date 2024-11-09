import LoadingBar from "@/features/common/components/LoadingBar";
import { UserFavorites } from "@/types/favorite";
import {
  AddedArtist,
  AddedItem,
  AddedTrack,
  SimplifiedArtist,
  SimplifiedSearchResponse,
  SimplifiedTrack,
} from "@/types/search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import NoResultsMessage from "./NoResultsMessage";
import SearchInput from "./SearchInput";
import SearchResultList from "./SearchResultList";

interface SearchModalProps {
  closeModal: () => void;
  modalType: "artist" | "track";
  activeSection: string;
  handleAddItem: (section: string, item: AddedItem) => void;
  userFavorites: UserFavorites;
}

const SearchModal = ({
  closeModal,
  modalType,
  activeSection,
  handleAddItem,
  userFavorites,
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

  const { data, isLoading } = useQuery<SimplifiedSearchResponse, Error>({
    queryKey,
    queryFn: () =>
      axios
        .get<SimplifiedSearchResponse>("/api/search", {
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
    } else if (modalType === "track" && "popularity" in item) {
      const addedTrack: AddedTrack = {
        trackId: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        artists: item.artists,
        previewUrl: item.previewUrl,
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
  const placeholder = t("placeholder", { target, ns: "profile" });
  const searchButtonLabel = t("search", { ns: "profile" });
  const addButtonLabel = t("add", { ns: "profile" });
  const noResultMessage = t("no_result", { ns: "profile" });

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

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
          placeholder={placeholder}
          searchButtonLabel={searchButtonLabel}
        />

        {isLoading && <LoadingBar />}

        {searchResults.length > 0 && (
          <SearchResultList
            searchResults={searchResults}
            modalType={modalType}
            handleSelectItem={handleSelectItem}
            addButtonLabel={addButtonLabel}
            userFavorites={userFavorites}
          />
        )}

        {hasSearched && searchResults.length === 0 && !isLoading && (
          <NoResultsMessage message={noResultMessage} />
        )}
      </div>
    </div>
  );
};

export default SearchModal;
