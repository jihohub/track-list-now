import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import { APIError, DatabaseError } from "@/types/error";
import {
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface LikesResponseData {
  artists?: {
    items: SimplifiedArtist[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  tracks?: {
    items: SimplifiedTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  albums?: {
    items: SimplifiedAlbum[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<LikesResponseData>,
) => {
  const { userId, type, limit, offset } = req.query;

  // userId 유효성 검사
  if (!userId || Array.isArray(userId)) {
    throw new ValidationError("Invalid userId");
  }

  const userIdInt = parseInt(userId as string, 10);
  if (Number.isNaN(userIdInt)) {
    throw new ValidationError("userId must be a number");
  }

  // type 유효성 검사
  if (!type || Array.isArray(type)) {
    throw new ValidationError("Invalid type parameter");
  }

  let requestedTypes = type.split(",").map((t) => t.trim());
  if (requestedTypes.includes("all")) {
    requestedTypes = ["artist", "track", "album"];
  }

  const validTypes = ["artist", "track", "album"];
  const isValid = requestedTypes.every((t) => validTypes.includes(t));
  if (!isValid) {
    throw new ValidationError("One or more types are invalid");
  }

  // limit, offset 유효성 검사
  const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
  const parsedOffset = typeof offset === "string" ? parseInt(offset, 10) : 0;

  if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new ValidationError("Invalid limit value");
  }

  if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
    throw new ValidationError("Invalid offset value");
  }

  try {
    const responseData: LikesResponseData = {};

    // Promise.all을 사용하여 병렬로 데이터 조회
    await Promise.all(
      requestedTypes.map(async (itemType) => {
        /* eslint-disable default-case */
        switch (itemType) {
          case "artist": {
            const likedArtists = await prisma.userLikedArtist.findMany({
              where: { userId: userIdInt },
              include: { artist: true },
              orderBy: { createdAt: "desc" },
              skip: parsedOffset,
              take: parsedLimit,
            });

            const total = await prisma.userLikedArtist.count({
              where: { userId: userIdInt },
            });

            responseData.artists = {
              items: likedArtists.map((fav) => ({
                id: fav.artist.artistId,
                name: fav.artist.name,
                imageUrl: fav.artist.imageUrl,
                followers: fav.artist.followers,
              })),
              href: `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${parsedOffset}`,
              limit: parsedLimit,
              next:
                likedArtists.length === parsedLimit
                  ? `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${parsedOffset + parsedLimit}`
                  : null,
              offset: parsedOffset,
              previous:
                parsedOffset - parsedLimit >= 0
                  ? `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${parsedOffset - parsedLimit}`
                  : null,
              total,
            };
            break;
          }
          case "track": {
            const likedTracks = await prisma.userLikedTrack.findMany({
              where: { userId: userIdInt },
              include: { track: true },
              orderBy: { createdAt: "desc" },
              skip: parsedOffset,
              take: parsedLimit,
            });

            const total = await prisma.userLikedTrack.count({
              where: { userId: userIdInt },
            });

            responseData.tracks = {
              items: likedTracks.map((fav) => ({
                id: fav.track.trackId,
                name: fav.track.name,
                imageUrl: fav.track.imageUrl,
                artists: fav.track.artists,
                popularity: fav.track.popularity,
              })),
              href: `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${parsedOffset}`,
              limit: parsedLimit,
              next:
                likedTracks.length === parsedLimit
                  ? `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${parsedOffset + parsedLimit}`
                  : null,
              offset: parsedOffset,
              previous:
                parsedOffset - parsedLimit >= 0
                  ? `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${parsedOffset - parsedLimit}`
                  : null,
              total,
            };
            break;
          }
          case "album": {
            const likedAlbums = await prisma.userLikedAlbum.findMany({
              where: { userId: userIdInt },
              include: { album: true },
              orderBy: { createdAt: "desc" },
              skip: parsedOffset,
              take: parsedLimit,
            });

            const total = await prisma.userLikedAlbum.count({
              where: { userId: userIdInt },
            });

            responseData.albums = {
              items: likedAlbums.map((fav) => ({
                id: fav.album.albumId,
                name: fav.album.name,
                imageUrl: fav.album.imageUrl,
                artists: fav.album.artists,
                releaseDate: fav.album.releaseDate,
              })),
              href: `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${parsedOffset}`,
              limit: parsedLimit,
              next:
                likedAlbums.length === parsedLimit
                  ? `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${parsedOffset + parsedLimit}`
                  : null,
              offset: parsedOffset,
              previous:
                parsedOffset - parsedLimit >= 0
                  ? `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${parsedOffset - parsedLimit}`
                  : null,
              total,
            };
            break;
          }
        }
      }),
    );

    return res.status(200).json(responseData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError("Database operation failed");
    }
    throw error;
  }
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
) => {
  const {
    userId,
    itemType,
    itemId,
    name,
    imageUrl,
    artists,
    followers,
    popularity,
    releaseDate,
  } = req.body;

  // 필수 필드 검증
  if (!userId || !itemType || !itemId || !name || !imageUrl) {
    throw new ValidationError("Missing required fields");
  }

  const validTypes = ["artist", "track", "album"];
  if (!validTypes.includes(itemType)) {
    throw new ValidationError("Invalid item type");
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      /* eslint-disable default-case */
      switch (itemType) {
        case "artist": {
          const existingArtist = await prismaTransaction.artist.findUnique({
            where: { artistId: itemId },
          });

          if (!existingArtist) {
            await prismaTransaction.artist.create({
              data: {
                artistId: itemId,
                name,
                imageUrl,
                followers,
              },
            });
          }

          await prismaTransaction.userLikedArtist.create({
            data: {
              userId,
              artistId: itemId,
            },
          });
          break;
        }
        case "track": {
          const existingTrack = await prismaTransaction.track.findUnique({
            where: { trackId: itemId },
          });

          if (!existingTrack) {
            await prismaTransaction.track.create({
              data: {
                trackId: itemId,
                name,
                imageUrl,
                artists,
                popularity,
              },
            });
          }

          await prismaTransaction.userLikedTrack.create({
            data: {
              userId,
              trackId: itemId,
            },
          });
          break;
        }
        case "album": {
          const existingAlbum = await prismaTransaction.album.findUnique({
            where: { albumId: itemId },
          });

          if (!existingAlbum) {
            await prismaTransaction.album.create({
              data: {
                albumId: itemId,
                name,
                imageUrl,
                artists,
                releaseDate,
              },
            });
          }

          await prismaTransaction.userLikedAlbum.create({
            data: {
              userId,
              albumId: itemId,
            },
          });
          break;
        }
      }
    });

    return res.status(201).json({ message: "Item liked successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 중복 키 에러
      if (error.code === "P2002") {
        throw new DatabaseError("Item already liked");
      }
      throw new DatabaseError("Failed to like item");
    }
    throw error;
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
) => {
  const { userId, itemType, itemId } = req.body;

  if (!userId || !itemType || !itemId) {
    throw new ValidationError("Missing required fields");
  }

  const validTypes = ["artist", "track", "album"];
  if (!validTypes.includes(itemType)) {
    throw new ValidationError("Invalid item type");
  }

  try {
    /* eslint-disable consistent-return */
    await prisma.$transaction(async (prismaTransaction) => {
      const deleteResult = await (async () => {
        switch (itemType) {
          case "artist":
            return prismaTransaction.userLikedArtist.deleteMany({
              where: { userId, artistId: itemId },
            });
          case "track":
            return prismaTransaction.userLikedTrack.deleteMany({
              where: { userId, trackId: itemId },
            });
          case "album":
            return prismaTransaction.userLikedAlbum.deleteMany({
              where: { userId, albumId: itemId },
            });
        }
      })();

      if (!deleteResult || deleteResult.count === 0) {
        throw new ValidationError("Item not found or already unliked");
      }
    });

    return res.status(200).json({ message: "Item unliked successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError("Failed to unlike item");
    }
    throw error;
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LikesResponseData | { message: string }>,
) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      throw new APIError(`Method ${req.method} Not Allowed`, {
        statusCode: 405,
        errorCode: "METHOD_NOT_ALLOWED",
      });
  }
};

export default withErrorHandling(handler);
