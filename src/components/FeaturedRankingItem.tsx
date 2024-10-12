// /components/FeaturedRankingItem.tsx
import { RankedItemProps } from "@/types/types";
import { useTranslation } from "next-i18next";
import ItemImage from "./ItemImage";

const FeaturedRankingItem = ({ index, item, type }: RankedItemProps) => {
  const { t } = useTranslation("common");

  return (
    <li className="mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-xl font-bold text-gray-400 mr-4">
          {index + 1}
        </span>
        <ItemImage
          imageUrl={type === "artist" ? item.imageUrl : item.albumImageUrl}
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
              {item.followers.toLocaleString()} {t("followers")}
            </p>
          )}
          {type === "track" && item.artistNames && (
            <p className="text-xs sm:text-sm text-gray-400 max-w-[100px] sm:max-w-[220px]">
              {item.artistNames}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-blue-300">
          {`${item.count} ${t("selected")}`}
        </p>
      </div>
    </li>
  );
};

export default FeaturedRankingItem;
