import { RankingSectionProps } from "@/types/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import ArtistOrTrackImage from "./ArtistOrTrackImage";

const RankingSection: React.FC<RankingSectionProps> = ({
  title,
  data,
  type,
  category,
}) => {
  const { t } = useTranslation("common");

  const renderList = (
    data: (Artist & { count: number })[] | (Track & { count: number })[],
    type: "artist" | "track",
  ) => (
    <ul>
      {data.length === 0 ? (
        <li className="flex justify-center items-center h-[280px]">
          <p className="text-gray-400 text-center">{t("no_data")}</p>
        </li>
      ) : (
        data.map((item, index) => (
          <li key={index} className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-400 mr-4">
                {index + 1}
              </span>
              <ArtistOrTrackImage
                imageUrl={
                  type === "artist"
                    ? item?.images?.[0]?.url
                    : item?.album?.images?.[0]?.url
                }
                type={type}
                alt={item.name}
                size="w-16 h-16"
                className="mr-4"
              />
              <div>
                <h3 className="text-xs sm:text-sm text-white font-semibold max-w-[100px] sm:max-w-[220px]">
                  {item.name}
                </h3>
                {type === "artist" && item.followers && (
                  <p className="text-xs sm:text-sm text-gray-400 max-w-[100px] sm:max-w-[220px]">
                    {item.followers.total.toLocaleString()} {t("followers")}
                  </p>
                )}
                {type === "track" && item.artists && (
                  <p className="text-xs sm:text-sm text-gray-400 max-w-[100px] sm:max-w-[220px]">
                    {item.artists.map((artist) => artist.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-300">
                {`${item.count}${t("selected")}`}
              </p>
            </div>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md flex flex-col h-full min-h-[376px]">
      <div className="flex-grow">
        <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
        {renderList(data, type)}
      </div>
      {data.length > 0 && (
        <Link href={`/ranking?category=${category}`}>
          <button className="text-blue-300 mt-4 self-end">
            {t("see_more")}
          </button>
        </Link>
      )}
    </div>
  );
};

export default RankingSection;
