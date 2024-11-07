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

type ResponseData = ArtistWithRanking[] | TrackWithRanking[];

const getRankingData = async (
  category: RankingCategory,
): Promise<ArtistWithRanking[] | TrackWithRanking[]> => {
  const TAKE_COUNT = 100;

  try {
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
        throw new ValidationError("Invalid category");
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 특정 Prisma 에러 코드에 따른 처리
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

    throw error; // ValidationError 등 다른 에러는 그대로 전파
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { method } = req;

  if (method !== "GET") {
    throw new APIError(`Method ${method} Not Allowed`, {
      statusCode: 405,
      errorCode: "METHOD_NOT_ALLOWED",
    });
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
    throw new ValidationError("Invalid category parameter");
  }

  try {
    const rankingData = await getRankingData(category as RankingCategory);

    // 결과 데이터 검증
    if (!rankingData || rankingData.length === 0) {
      return res.status(200).json([]); // 빈 배열 반환
    }

    return res.status(200).json(rankingData);
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof DatabaseError ||
      error instanceof APIError
    ) {
      throw error;
    }

    // 예상치 못한 에러
    throw new DatabaseError("Failed to fetch ranking data");
  }
};

export default withErrorHandling(handler);
