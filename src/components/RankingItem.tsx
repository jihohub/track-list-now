import { RankingItemProps } from "@/types/types";
import { useTranslation } from "next-i18next";
import React from "react";

const RankingItem: React.FC<RankingItemProps> = ({
  index,
  item,
  type,
  category,
}) => {
  const { t } = useTranslation("common");
  return (
    <li className="flex justify-between items-center bg-zinc-900 rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <span className="text-sm sm:text-lg font-bold text-gray-400 w-8 sm:w-12 text-center">
          {index + 1}
        </span>
        <img
          className={`w-12 h-12 sm:w-16 sm:h-16 ${
            type === "artist" ? "rounded-full" : "rounded-lg"
          }`}
          src={item.imageUrl}
          alt={item.name}
        />
        <div>
          <h3 className="text-xs sm:text-lg text-white font-semibold max-w-[150px] sm:max-w-max">
            {item.name}
          </h3>
          {type === "artist" ? (
            <p className="text-xs sm:text-sm text-gray-400 max-w-[150px] sm:max-w-max">
              {item.followers.toLocaleString()} {t("followers")}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 max-w-[150px] sm:max-w-max">
              {item.artists}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs sm:text-sm text-blue-300">
          {item.count}
          {t("selected")}
        </p>
      </div>
    </li>
  );
};

export default RankingItem;
