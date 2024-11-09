import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import { APIError, DatabaseError } from "@/types/error";
import { FeaturedRankingData } from "@/types/ranking";
import { ArtistRankingType, Prisma, TrackRankingType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const RANKING_LIMIT = 3;

const fetchArtistRanking = (rankingType: ArtistRankingType) => {
  return prisma.artistRanking.findMany({
    where: { rankingType },
    orderBy: [{ count: "desc" }, { followers: "desc" }],
    take: RANKING_LIMIT,
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
  });
};

const fetchTrackRanking = (rankingType: TrackRankingType) => {
  return prisma.trackRanking.findMany({
    where: { rankingType },
    orderBy: [{ count: "desc" }, { popularity: "desc" }],
    take: RANKING_LIMIT,
    include: {
      track: {
        select: {
          id: true,
          trackId: true,
          name: true,
          imageUrl: true,
          artists: true,
          popularity: true,
        },
      },
    },
  });
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<FeaturedRankingData>,
) => {
  if (req.method !== "GET") {
    throw new APIError(`Method ${req.method} Not Allowed`, {
      statusCode: 405,
      errorCode: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const [
      allTimeArtistsRanking,
      allTimeTracksRanking,
      currentArtistsRanking,
      currentTracksRanking,
    ] = await Promise.all([
      fetchArtistRanking("ALL_TIME_ARTIST"),
      fetchTrackRanking("ALL_TIME_TRACK"),
      fetchArtistRanking("CURRENT_ARTIST"),
      fetchTrackRanking("CURRENT_TRACK"),
    ]).catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(
          `Failed to fetch ranking data: ${error.message}`,
        );
      }
      throw error;
    });

    if (
      !allTimeArtistsRanking ||
      !allTimeTracksRanking ||
      !currentArtistsRanking ||
      !currentTracksRanking
    ) {
      throw new DatabaseError("Failed to fetch complete ranking data");
    }

    const rankingData: FeaturedRankingData = {
      allTimeArtistsRanking,
      allTimeTracksRanking,
      currentArtistsRanking,
      currentTracksRanking,
    };

    return res.status(200).json(rankingData);
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof APIError) {
      throw error;
    }

    // 예상치 못한 에러
    throw new DatabaseError(
      "An unexpected error occurred while fetching ranking data",
    );
  }
};

export default withErrorHandling(handler);
