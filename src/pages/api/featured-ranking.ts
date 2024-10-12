// /pages/api/featured-ranking.ts
import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

interface ArtistRanking {
  artistId: string;
  count: number;
  followers: number;
  artist: {
    id: string;
    name: string;
    imageUrl: string;
    followers: number;
    // 필요한 다른 필드
  };
}

interface TrackRanking {
  trackId: string;
  count: number;
  popularity: number;
  track: {
    id: string;
    name: string;
    albumImageUrl: string;
    popularity: number;
    // 필요한 다른 필드
  };
}

interface FullRankingData {
  allTimeArtistsRanking: ArtistRanking[];
  allTimeTracksRanking: TrackRanking[];
  currentArtistsRanking: ArtistRanking[];
  currentTracksRanking: TrackRanking[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FullRankingData | { error: string }>,
) {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const [
      allTimeArtistsRanking,
      allTimeTracksRanking,
      currentArtistsRanking,
      currentTracksRanking,
    ] = await Promise.all([
      prisma.artistRanking.findMany({
        where: { rankingType: "ALL_TIME_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: 3,
        include: { artist: true },
      }),
      prisma.trackRanking.findMany({
        where: { rankingType: "ALL_TIME_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: 3,
        include: { track: true },
      }),
      prisma.artistRanking.findMany({
        where: { rankingType: "CURRENT_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: 3,
        include: { artist: true },
      }),
      prisma.trackRanking.findMany({
        where: { rankingType: "CURRENT_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: 3,
        include: { track: true },
      }),
    ]);

    const rankingData: FullRankingData = {
      allTimeArtistsRanking,
      allTimeTracksRanking,
      currentArtistsRanking,
      currentTracksRanking,
    };

    return res.status(200).json(rankingData);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
