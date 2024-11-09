import { useTranslation } from "next-i18next";

interface RankingCategoryTabsProps {
  category: string;
  onCategoryChange: (newCategory: string) => void;
}

const RankingCategoryTabs = ({
  category,
  onCategoryChange,
}: RankingCategoryTabsProps) => {
  const { t } = useTranslation("common");

  const tabs = [
    {
      key: "ALL_TIME_ARTIST",
      label: t("all_time_favorite_artists"),
      value: "all-time-artist",
    },
    {
      key: "ALL_TIME_TRACK",
      label: t("all_time_favorite_tracks"),
      value: "all-time-track",
    },
    {
      key: "CURRENT_ARTIST",
      label: t("current_favorite_artists"),
      value: "current-artist",
    },
    {
      key: "CURRENT_TRACK",
      label: t("current_favorite_tracks"),
      value: "current-track",
    },
  ];

  return (
    <div className="flex justify-center space-x-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onCategoryChange(tab.value)}
          className={`text-xs md:text-lg px-0 md:px-4 py-1 md:py-2 duration-200 
            ${
              category === tab.key
                ? "text-neonBlue font-bold"
                : "text-gray-300  hover:text-neonBlue"
            }
          `}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default RankingCategoryTabs;
