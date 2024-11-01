import ErrorComponent from "@/features/common/ErrorComponent";
import NoResultsMessage from "@/features/search/NoResultsMessage";
import SearchResultList from "@/features/search/SearchResultList";
import SearchTabs from "@/features/search/SearchTabs";
import {
  SearchResponseData,
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LikedSection = () => {
  const { t } = useTranslation(["common", "search"]);
  const router = useRouter();
  const { type } = router.query;

  const [currentType, setCurrentType] = useState<string>(
    typeof type === "string" ? type : "all",
  );
  const { data: session } = useSession();

  const userId = session?.user.id;

  const fetchLikedItems = async ({
    pageParam = 0,
  }: QueryFunctionContext): Promise<SearchResponseData> => {
    const response = await axios.get<SearchResponseData>("/api/likes", {
      params: {
        userId,
        type: currentType,
        limit: currentType === "all" ? 5 : 10,
        offset: pageParam,
      },
    });
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<SearchResponseData, Error>({
    queryKey: ["likes", userId, currentType],
    queryFn: fetchLikedItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (currentType === "artist" && lastPage.artists?.next) {
        return lastPage.artists.offset + lastPage.artists.limit;
      }
      if (currentType === "track" && lastPage.tracks?.next) {
        return lastPage.tracks.offset + lastPage.tracks.limit;
      }
      if (currentType === "album" && lastPage.albums?.next) {
        return lastPage.albums.offset + lastPage.albums.limit;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (type && typeof type === "string") {
      setCurrentType(type);
      refetch();
    }
  }, [type, refetch]);

  const noResultMessage = t("no_result", { ns: "search" });

  const artists: SimplifiedArtist[] = [];
  const tracks: SimplifiedTrack[] = [];
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
        {t("liked_items", { ns: "search" })}
      </h2>

      <SearchTabs currentType={currentType} setCurrentType={setCurrentType} />

      {currentType === "all" && (
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

      {currentType !== "all" && (
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

      {tracks.length === 0 &&
        artists.length === 0 &&
        albums.length === 0 &&
        !isLoading && <NoResultsMessage message={noResultMessage} />}
    </div>
  );
};

export default LikedSection;
