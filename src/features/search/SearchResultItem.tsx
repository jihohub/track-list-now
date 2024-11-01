import TImage from "@/features/common/TImage";
import {
  SearchResult,
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface SearchResultItemProps {
  result: SearchResult;
  listType: "artist" | "track" | "album";
}

const SearchResultItem = ({ result, listType }: SearchResultItemProps) => {
  const { t } = useTranslation("common");

  // 타입 가드 함수 정의
  const isArtist = (res: SearchResult): res is SimplifiedArtist => {
    return (res as SimplifiedArtist).followers !== undefined;
  };

  const isTrack = (res: SearchResult): res is SimplifiedTrack => {
    return (res as SimplifiedTrack).popularity !== undefined;
  };

  const isAlbum = (res: SearchResult): res is SimplifiedAlbum => {
    return (res as SimplifiedAlbum).releaseDate !== undefined;
  };

  const getDetailPageUrl = () => {
    if (listType === "artist") {
      return `/artist/${(result as SimplifiedArtist).id}`;
    }
    if (listType === "track") {
      return `/track/${(result as SimplifiedTrack).id}`;
    }
    if (listType === "album") {
      return `/album/${(result as SimplifiedAlbum).id}`;
    }
    return "#";
  };

  return (
    <li className="flex items-center justify-between text-sm text-white cursor-pointer bg-zinc-900 hover:bg-gray-700 p-2 rounded-lg">
      <Link
        href={getDetailPageUrl()}
        passHref
        className="flex justify-between items-center w-full"
      >
        <div className="flex items-center">
          <TImage
            imageUrl={result.imageUrl}
            type={listType}
            alt={result.name}
            size="w-10 h-10"
            className="mr-4 rounded-full"
          />
          <div className="flex flex-col">
            <span>{result.name}</span>
            {listType === "artist" && (
              <span className="text-gray-400 text-xs">
                {isArtist(result) && result.followers.toLocaleString()}{" "}
                {t("followers")}
              </span>
            )}
            {listType !== "artist" && (
              <span className="text-gray-400 text-xs">
                {isTrack(result) || isAlbum(result) ? result.artists : ""}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SearchResultItem;
