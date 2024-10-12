// /pages/api/ranking.ts
import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

type RankingCategory =
  | "allTimeArtists"
  | "allTimeTracks"
  | "currentArtists"
  | "currentTracks";

async function getRankingData(category: RankingCategory) {
  const TAKE_COUNT = 100;

  switch (category) {
    case "allTimeArtists":
      return prisma.artistRanking.findMany({
        where: { rankingType: "ALL_TIME_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: TAKE_COUNT,
        include: { artist: true },
      });

    case "allTimeTracks":
      return prisma.trackRanking.findMany({
        where: { rankingType: "ALL_TIME_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: TAKE_COUNT,
        include: { track: true },
      });

    case "currentArtists":
      return prisma.artistRanking.findMany({
        where: { rankingType: "CURRENT_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: TAKE_COUNT,
        include: { artist: true },
      });

    case "currentTracks":
      return prisma.trackRanking.findMany({
        where: { rankingType: "CURRENT_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: TAKE_COUNT,
        include: { track: true },
      });

    default:
      throw new Error("Invalid category");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { category } = req.query;

  // 런타임 타입 검증
  const validCategories: RankingCategory[] = [
    "allTimeArtists",
    "allTimeTracks",
    "currentArtists",
    "currentTracks",
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
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
