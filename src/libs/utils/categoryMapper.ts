type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

const convertToURL = (category: RankingCategory): string => {
  return category.toLowerCase().replace(/_/g, "-");
};

const convertToCategory = (categoryURL: string): RankingCategory | null => {
  const categoryMap: { [key: string]: RankingCategory } = {
    "all-time-artist": "ALL_TIME_ARTIST",
    "all-time-track": "ALL_TIME_TRACK",
    "current-artist": "CURRENT_ARTIST",
    "current-track": "CURRENT_TRACK",
  };

  return categoryMap[categoryURL] || null;
};

export { convertToCategory, convertToURL };
