import prisma from "@/libs/prisma/prismaClient";
import { FullRankingData } from "@/types/ranking";
import { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  error: string;
}

type ResponseData = FullRankingData | ErrorResponse;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
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
        include: {
          artist: {
            select: {
              id: true,
              artistId: true,
              name: true,
              imageUrl: true,
              followers: true,
            },
          },
        },
      }),
      prisma.trackRanking.findMany({
        where: { rankingType: "ALL_TIME_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: 3,
        include: {
          track: {
            select: {
              id: true,
              trackId: true,
              name: true,
              albumImageUrl: true,
              artists: true,
              popularity: true,
            },
          },
        },
      }),
      prisma.artistRanking.findMany({
        where: { rankingType: "CURRENT_ARTIST" },
        orderBy: [{ count: "desc" }, { followers: "desc" }],
        take: 3,
        include: {
          artist: {
            select: {
              id: true,
              artistId: true,
              name: true,
              imageUrl: true,
              followers: true,
            },
          },
        },
      }),
      prisma.trackRanking.findMany({
        where: { rankingType: "CURRENT_TRACK" },
        orderBy: [{ count: "desc" }, { popularity: "desc" }],
        take: 3,
        include: {
          track: {
            select: {
              id: true,
              trackId: true,
              name: true,
              albumImageUrl: true,
              artists: true,
              popularity: true,
            },
          },
        },
      }),
    ]);

    const rankingData: FullRankingData = {
      allTimeArtistsRanking,
      allTimeTracksRanking,
      currentArtistsRanking,
      currentTracksRanking,
    };

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
