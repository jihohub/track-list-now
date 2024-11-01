import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  liked?: boolean;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { userId, itemType, itemId } = req.query;

  // 쿼리 파라미터 유효성 검사
  if (
    !userId ||
    Array.isArray(userId) ||
    !itemType ||
    Array.isArray(itemType) ||
    !itemId ||
    Array.isArray(itemId)
  ) {
    return res
      .status(400)
      .json({ error: "Invalid or missing query parameters" });
  }

  const parsedUserId = parseInt(userId as string, 10);

  if (Number.isNaN(parsedUserId)) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  const validTypes = ["artist", "track", "album"];

  if (!validTypes.includes(itemType)) {
    return res.status(400).json({ error: "Invalid item type" });
  }

  try {
    let liked = false;

    if (itemType === "artist") {
      const count = await prisma.userLikedArtist.count({
        where: { userId: parsedUserId, artistId: itemId },
      });
      liked = count > 0;
    } else if (itemType === "track") {
      const count = await prisma.userLikedTrack.count({
        where: { userId: parsedUserId, trackId: itemId },
      });
      liked = count > 0;
    } else if (itemType === "album") {
      const count = await prisma.userLikedAlbum.count({
        where: { userId: parsedUserId, albumId: itemId },
      });
      liked = count > 0;
    }

    return res.status(200).json({ liked });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
