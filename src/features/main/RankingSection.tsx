import TItem from "@/features/common/TItem";
import { convertToURL } from "@/libs/utils/categoryMapper";
import { ArtistRanking, TrackRanking } from "@prisma/client";
import { useTranslation } from "next-i18next";
import Link from "next/link";

type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

interface ArtistWithRanking
  extends Omit<ArtistRanking, "updatedAt" | "rankingType"> {
  rankingType: RankingCategory;
  count: number;
  updatedAt: string;
  artist: {
    id: number;
    artistId: string;
    name: string;
    imageUrl: string;
    followers: number;
  };
}

interface TrackWithRanking
  extends Omit<TrackRanking, "updatedAt" | "rankingType"> {
  rankingType: RankingCategory;
  count: number;
  updatedAt: string;
  track: {
    id: number;
    trackId: string;
    name: string;
    albumImageUrl: string;
    artists: string;
    popularity: number;
  };
}

interface RankingSectionProps {
  title: string;
  data: ArtistWithRanking[] | TrackWithRanking[];
  type: "artist" | "track";
  category: RankingCategory;
}

const isArtistWithRanking = (
  item: ArtistWithRanking | TrackWithRanking,
): item is ArtistWithRanking => {
  return (item as ArtistWithRanking).artist !== undefined;
};

const RankingSection = ({
  title,
  data,
  type,
  category,
}: RankingSectionProps) => {
  const { t } = useTranslation(["common", "main"]);
  const categoryURL = convertToURL(category);

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md flex flex-col h-full min-h-[376px]">
      <div className="flex-grow">
        <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
        <ul>
          {data.length === 0 ? (
            <li className="flex justify-center items-center h-[280px]">
              <p className="text-gray-400 text-center">{t("no_data")}</p>
            </li>
          ) : (
            data.map((item, index) => {
              if (type === "artist" && isArtistWithRanking(item)) {
                return (
                  <TItem
                    key={item.artist.artistId}
                    index={index}
                    item={item}
                    type="artist"
                    isFeatured
                  />
                );
              }
              if (type === "track" && !isArtistWithRanking(item)) {
                return (
                  <TItem
                    key={item.track.trackId}
                    index={index}
                    item={item}
                    type="track"
                    isFeatured
                  />
                );
              }
              return null;
            })
          )}
        </ul>
      </div>
      {data.length > 0 && (
        <Link href={`/ranking/${categoryURL}`}>
          <button className="text-blue-300 mt-4 self-end" type="button">
            {t("see_more", { ns: "main" })}
          </button>
        </Link>
      )}
    </div>
  );
};

export default RankingSection;
