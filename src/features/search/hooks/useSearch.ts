import useFetchSearchResults from "@/features/search/queries/useFetchSearchResults";
import {
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export const useSearch = () => {
  const router = useRouter();
  const { q, type } = router.query;
  const resultsRef = useRef<HTMLUListElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>(
    typeof q === "string" ? q : "",
  );
  const [currentType, setCurrentType] = useState<string>(
    typeof type === "string" ? type : "all",
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(
    typeof q === "string" ? q : "",
  );
  const [searchType, setSearchType] = useState<string>(
    typeof type === "string" ? type : "all",
  );

  const searchResults = useFetchSearchResults(
    searchTerm,
    searchType,
    hasSearched,
  );

  const handleSearch = (newType?: string) => {
    if (!searchQuery.trim()) return;

    const typeToUse = newType || currentType;
    setSearchTerm(searchQuery.trim());
    setSearchType(typeToUse);
    setHasSearched(true);

    router.push({
      pathname: "/search",
      query: { q: searchQuery.trim(), type: typeToUse },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTypeChange = (newType: string) => {
    setCurrentType(newType);
    if (hasSearched && searchQuery.trim()) {
      handleSearch(newType);
    }
  };

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [searchResults.data]);

  useEffect(() => {
    if (
      q &&
      type &&
      typeof q === "string" &&
      typeof type === "string" &&
      !hasSearched
    ) {
      setSearchQuery(q.trim());
      setSearchTerm(q.trim());
      setCurrentType(type);
      setSearchType(type);
      setHasSearched(true);
    }
  }, [q, type, hasSearched]);

  // Process search results
  const { artists, tracks, albums } = (searchResults.data?.pages || []).reduce(
    (
      acc: {
        artists: SimplifiedArtist[];
        tracks: SimplifiedTrack[];
        albums: SimplifiedAlbum[];
      },
      page,
    ) => ({
      artists: [...acc.artists, ...(page.artists?.items || [])],
      tracks: [...acc.tracks, ...(page.tracks?.items || [])],
      albums: [...acc.albums, ...(page.albums?.items || [])],
    }),
    { artists: [], tracks: [], albums: [] },
  );

  return {
    searchQuery,
    setSearchQuery,
    currentType,
    handleSearch,
    handleKeyPress,
    handleTypeChange,
    hasSearched,
    isLoading: searchResults.isLoading,
    isError: searchResults.isError,
    error: searchResults.error,
    fetchNextPage: searchResults.fetchNextPage,
    hasNextPage: searchResults.hasNextPage,
    artists,
    tracks,
    albums,
    resultsRef,
  };
};
