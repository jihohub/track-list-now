import useArtistAlbums from "@/features/artist/queries/useArtistAlbums";
import GlobalLoadingBar from "@/features/common/components/GlobalLoadingBar";
import SearchResultItem from "@/features/search/components/SearchResultItem";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

interface AlbumsTabProps {
  artistId: string;
}

const AlbumsTab = ({ artistId }: AlbumsTabProps) => {
  const { t } = useTranslation(["artist"]);
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useArtistAlbums({
      artistId,
      enabled: true,
    });

  if (isLoading) return <GlobalLoadingBar />;
  if (isError)
    return <div className="text-red-500">{t("error.loading_albums")}</div>;

  const albums = data?.pages.flatMap((page) => page.items) ?? [];

  if (!albums.length) {
    return <div className="text-gray-400 text-center">{t("no_albums")}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-white mb-4">{t("albums")}</h2>
      <InfiniteScroll
        dataLength={albums.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage ?? false}
        loader={<GlobalLoadingBar />}
      >
        <ul className="space-y-2">
          {albums.map((album) => (
            <SearchResultItem
              key={album.id}
              result={{
                id: album.id,
                name: album.name,
                imageUrl: album.images[0]?.url,
                artists: album.artists.map((artist) => artist.name).join(", "),
                releaseDate: album.release_date,
              }}
              listType="album"
            />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default AlbumsTab;
