import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import { DatabaseError, ValidationError } from "@/types/error";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  liked: boolean;
}

const VALID_TYPES = ["artist", "track", "album"] as const;
type ItemType = (typeof VALID_TYPES)[number];

const checkLikeStatus = async (
  userId: number,
  itemType: ItemType,
  itemId: string,
): Promise<boolean> => {
  try {
    let count: number;

    switch (itemType) {
      case "artist":
        count = await prisma.userLikedArtist.count({
          where: { userId, artistId: itemId },
        });
        break;
      case "track":
        count = await prisma.userLikedTrack.count({
          where: { userId, trackId: itemId },
        });
        break;
      case "album":
        count = await prisma.userLikedAlbum.count({
          where: { userId, albumId: itemId },
        });
        break;
      default:
        throw new ValidationError("Invalid item type");
    }

    return count > 0;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(`Database operation failed: ${error.message}`);
    }
    throw error;
  }
};

const validateInput = (
  userId: unknown,
  itemType: unknown,
  itemId: unknown,
): { parsedUserId: number; validatedType: ItemType; validatedId: string } => {
  // userId 검증
  if (!userId || Array.isArray(userId) || typeof userId !== "string") {
    throw new ValidationError("Invalid or missing userId");
  }

  const parsedUserId = parseInt(userId, 10);
  if (Number.isNaN(parsedUserId)) {
    throw new ValidationError("userId must be a number");
  }

  // itemType 검증
  if (!itemType || Array.isArray(itemType) || typeof itemType !== "string") {
    throw new ValidationError("Invalid or missing itemType");
  }

  if (!VALID_TYPES.includes(itemType as ItemType)) {
    throw new ValidationError("Invalid item type");
  }

  // itemId 검증
  if (!itemId || Array.isArray(itemId) || typeof itemId !== "string") {
    throw new ValidationError("Invalid or missing itemId");
  }

  // Spotify ID 형식 검증 (선택적)
  if (!itemId.match(/^[0-9A-Za-z]{22}$/)) {
    throw new ValidationError("Invalid item ID format");
  }

  return {
    parsedUserId,
    validatedType: itemType as ItemType,
    validatedId: itemId,
  };
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { userId, itemType, itemId } = req.query;

  const { parsedUserId, validatedType, validatedId } = validateInput(
    userId,
    itemType,
    itemId,
  );

  const liked = await checkLikeStatus(parsedUserId, validatedType, validatedId);

  return res.status(200).json({ liked });
};

export default withErrorHandling(handler);
