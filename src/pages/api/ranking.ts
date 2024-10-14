import prisma from "@/libs/prisma/prismaClient";
import { Artist, ArtistRanking, Track, TrackRanking } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type RankingCategory =
  | "ALL_TIME_ARTIST"
  | "ALL_TIME_TRACK"
  | "CURRENT_ARTIST"
  | "CURRENT_TRACK";

type AllTimeArtistsResponse = (ArtistRanking & { artist: Artist })[];
type AllTimeTracksResponse = (TrackRanking & { track: Track })[];
type CurrentArtistsResponse = (ArtistRanking & { artist: Artist })[];
type CurrentTracksResponse = (TrackRanking & { track: Track })[];

type ResponseData =
  | AllTimeArtistsResponse
  | AllTimeTracksResponse
  | CurrentArtistsResponse
  | CurrentTracksResponse
  | { error: string };

const getRankingData = async (
  category: RankingCategory,
): Promise<
  | AllTimeArtistsResponse
  | AllTimeTracksResponse
  | CurrentArtistsResponse
  | CurrentTracksResponse
> => {
  const TAKE_COUNT = 100;

  switch (category) {
    case "ALL_TIME_ARTIST":
      return prisma.artistRanking.findMany({
        where: { rankingType: "ALL_TIME_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: TAKE_COUNT,
        include: { artist: true },
      });

    case "ALL_TIME_TRACK":
      return prisma.trackRanking.findMany({
        where: { rankingType: "ALL_TIME_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: TAKE_COUNT,
        include: { track: true },
      });

    case "CURRENT_ARTIST":
      return prisma.artistRanking.findMany({
        where: { rankingType: "CURRENT_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: TAKE_COUNT,
        include: { artist: true },
      });

    case "CURRENT_TRACK":
      return prisma.trackRanking.findMany({
        where: { rankingType: "CURRENT_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: TAKE_COUNT,
        include: { track: true },
      });

    default:
      throw new Error("Invalid category");
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { category } = req.query;

  const validCategories: RankingCategory[] = [
    "ALL_TIME_ARTIST",
    "ALL_TIME_TRACK",
    "CURRENT_ARTIST",
    "CURRENT_TRACK",
  ];
  if (
    typeof category !== "string" ||
    !validCategories.includes(category as RankingCategory)
  ) {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const rankingData = await getRankingData(category as RankingCategory);
    return res.status(200).json(rankingData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
