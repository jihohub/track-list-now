import ErrorComponent from "@/features/common/components/ErrorComponent";
import NoResultsMessage from "@/features/search/components/NoResultsMessage";
import SearchInput from "@/features/search/components/SearchInput";
import SearchResultList from "@/features/search/components/SearchResultList";
import SearchTabs from "@/features/search/components/SearchTabs";
import useFetchSearchResults from "@/features/search/queries/useFetchSearchResults";
import {
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SearchSection = () => {
  const { t } = useTranslation(["common", "search"]);
  const router = useRouter();
  const { q, type } = router.query;

  const [searchQuery, setSearchQuery] = useState<string>(
    typeof q === "string" ? q : "",
  );
  const [currentType, setCurrentType] = useState<string>(
    typeof type === "string" ? type : "all",
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const resultsRef = useRef<HTMLUListElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useFetchSearchResults(searchQuery, currentType);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    refetch();
    router.push({
      pathname: "/search",
      query: { q: searchQuery.trim(), type: currentType },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [data]);

  useEffect(() => {
    // 페이지 로드 시 URL의 쿼리 스트링을 기반으로 검색 수행
    if (q && type && typeof q === "string" && typeof type === "string") {
      setHasSearched(true);
      setSearchQuery(q.trim());
      setCurrentType(type);
      refetch();
    }
  }, [q, type, refetch]);

  const placeholder = t("placeholder", { ns: "search" });
  const searchButtonLabel = t("search", { ns: "search" });
  const noResultMessage = t("no_result", { ns: "search" });

  const tracks: SimplifiedTrack[] = [];
  const artists: SimplifiedArtist[] = [];
  const albums: SimplifiedAlbum[] = [];

  data?.pages.forEach((page) => {
    if (page.artists) {
      artists.push(...page.artists.items);
    }
    if (page.tracks) {
      tracks.push(...page.tracks.items);
    }
    if (page.albums) {
      albums.push(...page.albums.items);
    }
  });

  if (isError) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {t("search_for", { ns: "search" })}
      </h2>

      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        placeholder={placeholder}
        searchButtonLabel={searchButtonLabel}
      />

      <SearchTabs
        currentType={currentType}
        setCurrentType={setCurrentType}
        page="search"
      />

      {hasSearched && currentType === "all" && (
        <>
          {artists.length > 0 && (
            <SearchResultList
              searchResults={artists.slice(0, 5)}
              listType="artist"
              fetchMore={() => {}}
              hasMore={false}
            />
          )}
          {tracks.length > 0 && (
            <SearchResultList
              searchResults={tracks.slice(0, 5)}
              listType="track"
              fetchMore={() => {}}
              hasMore={false}
            />
          )}
          {albums.length > 0 && (
            <SearchResultList
              searchResults={albums.slice(0, 5)}
              listType="album"
              fetchMore={() => {}}
              hasMore={false}
            />
          )}
        </>
      )}

      {hasSearched && currentType !== "all" && (
        <SearchResultList
          searchResults={
            currentType.includes("artist")
              ? artists
              : currentType.includes("track")
                ? tracks
                : albums
          }
          listType={
            currentType.includes("artist")
              ? "artist"
              : currentType.includes("track")
                ? "track"
                : "album"
          }
          fetchMore={fetchNextPage}
          hasMore={hasNextPage || false}
        />
      )}

      {hasSearched &&
        tracks.length === 0 &&
        artists.length === 0 &&
        albums.length === 0 &&
        !isLoading && <NoResultsMessage message={noResultMessage} />}
    </div>
  );
};

export default SearchSection;
