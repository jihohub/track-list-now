import { SearchResult } from "@/types/search";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import GlobalLoadingBar from "../common/GlobalLoadingBar";
import SearchResultItem from "./SearchResultItem";

interface SearchResultListProps {
  searchResults: SearchResult[];
  listType: "artist" | "track" | "album";
  fetchMore: () => void;
  hasMore: boolean;
}

const SearchResultList = ({
  searchResults,
  listType,
  fetchMore,
  hasMore,
}: SearchResultListProps) => {
  const { t } = useTranslation(["common", "search"]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-2">
        {t(listType, { ns: "search" })}
      </h3>
      <InfiniteScroll
        dataLength={searchResults.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<GlobalLoadingBar />}
      >
        <ul className="space-y-2">
          {searchResults.map((result) => (
            <SearchResultItem
              key={result.id}
              result={result}
              listType={listType}
            />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default SearchResultList;
