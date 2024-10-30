export interface RankingSectionConstant {
  titleKey: string;
  type: "artist" | "track";
  category:
    | "ALL_TIME_ARTIST"
    | "ALL_TIME_TRACK"
    | "CURRENT_ARTIST"
    | "CURRENT_TRACK";
}

const rankingSections: RankingSectionConstant[] = [
  {
    titleKey: "all_time_favorite_artists",
    type: "artist",
    category: "ALL_TIME_ARTIST",
  },
  {
    titleKey: "all_time_favorite_tracks",
    type: "track",
    category: "ALL_TIME_TRACK",
  },
  {
    titleKey: "current_favorite_artists",
    type: "artist",
    category: "CURRENT_ARTIST",
  },
  {
    titleKey: "current_favorite_tracks",
    type: "track",
    category: "CURRENT_TRACK",
  },
];

export default rankingSections;
