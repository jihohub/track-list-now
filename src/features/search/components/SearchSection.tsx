import ErrorComponent from "@/features/common/components/ErrorComponent";
import NoResultsMessage from "@/features/search/components/NoResultsMessage";
import SearchInput from "@/features/search/components/SearchInput";
import SearchResultList from "@/features/search/components/SearchResultList";
import SearchSEO from "@/features/search/components/SearchSEO";
import SearchTabs from "@/features/search/components/SearchTabs";
import useSearch from "@/features/search/hooks/useSearch";
import handlePageError from "@/libs/utils/handlePageError";
import { useTranslation } from "next-i18next";

const SearchSection = () => {
  const { t } = useTranslation(["common", "search"]);
  const {
    searchQuery,
    setSearchQuery,
    currentType,
    handleSearch,
    handleKeyPress,
    handleTypeChange,
    hasSearched,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    artists,
    tracks,
    albums,
  } = useSearch();

  const placeholder = t("placeholder", { ns: "search" });
  const searchButtonLabel = t("search", { ns: "search" });
  const noResultMessage = t("no_result", { ns: "search" });

  if (isError) {
    const errorMessage = handlePageError(error);
    return <ErrorComponent message={errorMessage} />;
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
      <SearchSEO searchQuery={searchQuery} />
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
        setCurrentType={handleTypeChange}
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
              page="search"
            />
          )}
          {tracks.length > 0 && (
            <SearchResultList
              searchResults={tracks.slice(0, 5)}
              listType="track"
              fetchMore={() => {}}
              hasMore={false}
              page="search"
            />
          )}
          {albums.length > 0 && (
            <SearchResultList
              searchResults={albums.slice(0, 5)}
              listType="album"
              fetchMore={() => {}}
              hasMore={false}
              page="search"
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
          page="search"
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
