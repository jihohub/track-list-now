import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import { APIError, DatabaseError, ValidationError } from "@/types/error";
import {
  ArtistWithRanking,
  RankingCategory,
  TrackWithRanking,
} from "@/types/ranking";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface PaginatedResponse<T> {
  items: T[];
  offset: number;
  limit: number;
  total: number;
  next: string | null;
}

type RankingResponse =
  | PaginatedResponse<ArtistWithRanking>
  | PaginatedResponse<TrackWithRanking>;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const getRankingData = async (
  category: RankingCategory,
  offset: number,
  limit: number,
): Promise<RankingResponse> => {
  try {
    switch (category) {
      case "ALL_TIME_ARTIST":
      case "CURRENT_ARTIST": {
        const [data, count] = await Promise.all([
          prisma.artistRanking.findMany({
            where: { rankingType: category },
            orderBy: [{ count: "desc" }, { followers: "desc" }],
            take: limit,
            skip: offset,
            include: { artist: true },
          }),
          prisma.artistRanking.count({
            where: { rankingType: category },
          }),
        ]);

        const hasNextPage = offset + limit < count;
        return {
          items: data as ArtistWithRanking[],
          offset,
          limit,
          total: count,
          next: hasNextPage
            ? `/api/ranking?category=${category}&offset=${offset + limit}&limit=${limit}`
            : null,
        };
      }

      case "ALL_TIME_TRACK":
      case "CURRENT_TRACK": {
        const [data, count] = await Promise.all([
          prisma.trackRanking.findMany({
            where: { rankingType: category },
            orderBy: [{ count: "desc" }, { popularity: "desc" }],
            take: limit,
            skip: offset,
            include: { track: true },
          }),
          prisma.trackRanking.count({
            where: { rankingType: category },
          }),
        ]);

        const hasNextPage = offset + limit < count;
        return {
          items: data as TrackWithRanking[],
          offset,
          limit,
          total: count,
          next: hasNextPage
            ? `/api/ranking?category=${category}&offset=${offset + limit}&limit=${limit}`
            : null,
        };
      }

      default:
        throw new ValidationError("Invalid category");
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new DatabaseError("Unique constraint violation");
        case "P2025":
          throw new DatabaseError("Record not found");
        default:
          throw new DatabaseError(
            `Database operation failed: ${error.message}`,
          );
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new DatabaseError("Invalid database query");
    }

    throw error;
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RankingResponse>,
) => {
  const { method } = req;

  if (method !== "GET") {
    throw new APIError(`Method ${method} Not Allowed`, {
      statusCode: 405,
      errorCode: "METHOD_NOT_ALLOWED",
    });
  }

  const { category, offset: offsetParam, limit: limitParam } = req.query;

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
    throw new ValidationError("Invalid category parameter");
  }

  // Validate and parse pagination parameters
  const offset = Math.max(0, parseInt(offsetParam as string, 10) || 0);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(limitParam as string, 10) || DEFAULT_LIMIT),
  );

  try {
    const rankingData = await getRankingData(
      category as RankingCategory,
      offset,
      limit,
    );
    return res.status(200).json(rankingData);
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof DatabaseError ||
      error instanceof APIError
    ) {
      throw error;
    }

    throw new DatabaseError("Failed to fetch ranking data");
  }
};

export default withErrorHandling(handler);
