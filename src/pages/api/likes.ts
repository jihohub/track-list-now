import prisma from "@/libs/prisma/prismaClient";
import {
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { userId, type, limit, offset } = req.query;

    // userId 유효성 검사
    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!type || Array.isArray(type)) {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    let requestedTypes = type.split(",").map((t) => t.trim());
    if (requestedTypes.includes("all")) {
      requestedTypes = ["artist", "track", "album"];
    }

    const validTypes = ["artist", "track", "album"];
    const isValid = requestedTypes.every((t) => validTypes.includes(t));
    if (!isValid) {
      return res.status(400).json({ error: "One or more types are invalid" });
    }

    const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
    const parsedOffset = typeof offset === "string" ? parseInt(offset, 10) : 0;

    if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

    if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ error: "Invalid offset value" });
    }

    try {
      const userIdInt = parseInt(userId as string, 10);

      const responseData: LikesResponseData = {};

      if (requestedTypes.includes("artist")) {
        const likedArtists = await prisma.userLikedArtist.findMany({
          where: { userId: userIdInt },
          include: { artist: true },
          orderBy: { createdAt: "desc" },
          skip: parsedOffset,
          take: parsedLimit,
        });

        const simplifiedArtists: SimplifiedArtist[] = likedArtists.map(
          (fav) => ({
            id: fav.artist.artistId,
            name: fav.artist.name,
            imageUrl: fav.artist.imageUrl,
            followers: fav.artist.followers,
          }),
        );

        responseData.artists = {
          items: simplifiedArtists,
          href: `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${parsedOffset}`,
          limit: parsedLimit,
          next:
            likedArtists.length === parsedLimit
              ? `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${
                  parsedOffset + parsedLimit
                }`
              : null,
          offset: parsedOffset,
          previous:
            parsedOffset - parsedLimit >= 0
              ? `/api/likes?userId=${userIdInt}&type=artist&limit=${parsedLimit}&offset=${
                  parsedOffset - parsedLimit
                }`
              : null,
          total: await prisma.userLikedArtist.count({
            where: { userId: userIdInt },
          }),
        };
      }

      if (requestedTypes.includes("track")) {
        const likedTracks = await prisma.userLikedTrack.findMany({
          where: { userId: userIdInt },
          include: { track: true },
          orderBy: { createdAt: "desc" },
          skip: parsedOffset,
          take: parsedLimit,
        });

        const simplifiedTracks: SimplifiedTrack[] = likedTracks.map((fav) => ({
          id: fav.track.trackId,
          name: fav.track.name,
          artists: fav.track.artists,
          imageUrl: fav.track.imageUrl,
          popularity: fav.track.popularity,
        }));

        responseData.tracks = {
          items: simplifiedTracks,
          href: `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${parsedOffset}`,
          limit: parsedLimit,
          next:
            likedTracks.length === parsedLimit
              ? `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${
                  parsedOffset + parsedLimit
                }`
              : null,
          offset: parsedOffset,
          previous:
            parsedOffset - parsedLimit >= 0
              ? `/api/likes?userId=${userIdInt}&type=track&limit=${parsedLimit}&offset=${
                  parsedOffset - parsedLimit
                }`
              : null,
          total: await prisma.userLikedTrack.count({
            where: { userId: userIdInt },
          }),
        };
      }

      if (requestedTypes.includes("album")) {
        const likedAlbums = await prisma.userLikedAlbum.findMany({
          where: { userId: userIdInt },
          include: { album: true },
          orderBy: { createdAt: "desc" },
          skip: parsedOffset,
          take: parsedLimit,
        });

        const simplifiedAlbums: SimplifiedAlbum[] = likedAlbums.map((fav) => ({
          id: fav.album.albumId,
          name: fav.album.name,
          artists: fav.album.artists,
          imageUrl: fav.album.imageUrl,
          releaseDate: fav.album.releaseDate,
        }));

        responseData.albums = {
          items: simplifiedAlbums,
          href: `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${parsedOffset}`,
          limit: parsedLimit,
          next:
            likedAlbums.length === parsedLimit
              ? `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${
                  parsedOffset + parsedLimit
                }`
              : null,
          offset: parsedOffset,
          previous:
            parsedOffset - parsedLimit >= 0
              ? `/api/likes?userId=${userIdInt}&type=album&limit=${parsedLimit}&offset=${
                  parsedOffset - parsedLimit
                }`
              : null,
          total: await prisma.userLikedAlbum.count({
            where: { userId: userIdInt },
          }),
        };
      }

      return res.status(200).json(responseData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === "POST") {
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

    if (!userId || !itemType || !itemId || !name || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validTypes = ["artist", "track", "album"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    try {
      await prisma.$transaction(async (prismaTransaction) => {
        if (itemType === "artist") {
          // 아티스트 존재 여부 확인
          const existingArtist = await prismaTransaction.artist.findUnique({
            where: { artistId: itemId },
          });

          if (!existingArtist) {
            // 새로운 아티스트인 경우 생성 (followers는 Spotify에서 업데이트 예정)
            await prismaTransaction.artist.create({
              data: {
                artistId: itemId,
                name,
                imageUrl,
                followers,
              },
            });
          }

          // 사용자 좋아요 추가
          await prismaTransaction.userLikedArtist.create({
            data: {
              userId,
              artistId: itemId,
            },
          });
        } else if (itemType === "track") {
          // 트랙 존재 여부 확인
          const existingTrack = await prismaTransaction.track.findUnique({
            where: { trackId: itemId },
          });

          if (!existingTrack) {
            // 새로운 트랙인 경우 생성 (popularity는 Spotify에서 업데이트 예정)
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

          // 사용자 좋아요 추가
          await prismaTransaction.userLikedTrack.create({
            data: {
              userId,
              trackId: itemId,
            },
          });
        } else if (itemType === "album") {
          // 앨범 존재 여부 확인
          const existingAlbum = await prismaTransaction.album.findUnique({
            where: { albumId: itemId },
          });

          if (!existingAlbum) {
            // 새로운 앨범인 경우 생성 (popularity는 Spotify에서 업데이트 예정)
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

          // 사용자 좋아요 추가
          await prismaTransaction.userLikedAlbum.create({
            data: {
              userId,
              albumId: itemId,
            },
          });
        }
      });

      return res.status(201).json({ message: "Item liked successfully" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === "DELETE") {
    const { userId, itemType, itemId } = req.body;

    if (!userId || !itemType || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validTypes = ["artist", "track", "album"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    try {
      await prisma.$transaction(async (prismaTransaction) => {
        if (itemType === "artist") {
          // 사용자 좋아요 관계 삭제
          await prismaTransaction.userLikedArtist.deleteMany({
            where: {
              userId,
              artistId: itemId,
            },
          });
        } else if (itemType === "track") {
          // 사용자 좋아요 관계 삭제
          await prismaTransaction.userLikedTrack.deleteMany({
            where: {
              userId,
              trackId: itemId,
            },
          });
        } else if (itemType === "album") {
          // 사용자 좋아요 관계 삭제
          await prismaTransaction.userLikedAlbum.deleteMany({
            where: {
              userId,
              albumId: itemId,
            },
          });
        }
      });

      return res.status(200).json({ message: "Item unliked successfully" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
