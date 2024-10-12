// /pages/api/userFavorites.ts

import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

interface UpdateFavorites {
  userId: number;
  allTimeArtists: {
    id: string;
    name: string;
    imageUrl: string;
    followers: number;
  }[];
  allTimeTracks: {
    id: string;
    name: string;
    albumImageUrl: string;
    artists: { name: string }[];
    popularity: number;
  }[];
  currentArtists: {
    id: string;
    name: string;
    imageUrl: string;
    followers: number;
  }[];
  currentTracks: {
    id: string;
    name: string;
    albumImageUrl: string;
    artists: { name: string }[];
    popularity: number;
  }[];
}

interface UserFavoriteArtist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface UserFavoriteTrack {
  id: string;
  name: string;
  albumImageUrl: string;
  artists: { name: string }[];
  popularity: number;
}

interface UserFavorites {
  allTimeArtists: UserFavoriteArtist[];
  allTimeTracks: UserFavoriteTrack[];
  currentArtists: UserFavoriteArtist[];
  currentTracks: UserFavoriteTrack[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "PATCH":
      await handlePatch(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  try {
    // 사용자별 즐겨찾기 아티스트 조회
    const userFavoriteArtists = await prisma.userFavoriteArtists.findMany({
      where: { userId: parsedUserId },
      include: {
        artist: true,
      },
    });

    // 사용자별 즐겨찾기 트랙 조회
    const userFavoriteTracks = await prisma.userFavoriteTracks.findMany({
      where: { userId: parsedUserId },
      include: {
        track: true,
      },
    });

    const allTimeArtists = userFavoriteArtists
      .filter((fav) => fav.favoriteType === "ALL_TIME_ARTIST")
      .map((fav) => ({
        id: fav.artist.id,
        name: fav.artist.name,
        imageUrl: fav.artist.imageUrl,
        followers: fav.artist.followers,
      }));

    const currentArtists = userFavoriteArtists
      .filter((fav) => fav.favoriteType === "CURRENT_ARTIST")
      .map((fav) => ({
        id: fav.artist.id,
        name: fav.artist.name,
        imageUrl: fav.artist.imageUrl,
        followers: fav.artist.followers,
      }));

    const allTimeTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === "ALL_TIME_TRACK")
      .map((fav) => ({
        id: fav.track.id,
        name: fav.track.name,
        albumImageUrl: fav.track.albumImageUrl,
        artists: fav.track.artistNames.split(", ").map((name) => ({ name })),
        popularity: fav.track.popularity,
      }));

    const currentTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === "CURRENT_TRACK")
      .map((fav) => ({
        id: fav.track.id,
        name: fav.track.name,
        albumImageUrl: fav.track.albumImageUrl,
        artists: fav.track.artistNames.split(", ").map((name) => ({ name })),
        popularity: fav.track.popularity,
      }));

    const userFavorites = {
      allTimeArtists,
      currentArtists,
      allTimeTracks,
      currentTracks,
    };

    return res.status(200).json(userFavorites);
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    userId,
    allTimeArtists,
    allTimeTracks,
    currentArtists,
    currentTracks,
  } = req.body as UpdateFavorites;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      const existingFavoritesArtists =
        await prisma.userFavoriteArtists.findMany({ where: { userId } });
      const existingFavoritesTracks = await prisma.userFavoriteTracks.findMany({
        where: { userId },
      });

      const computeDifference = (existing, newItems) => {
        const existingIds = new Set(
          existing.map((item) => item.artistId || item.trackId),
        );
        const newIds = new Set(newItems.map((item) => item.id));
        const toAdd = newItems.filter((item) => !existingIds.has(item.id));
        const toRemove = existing.filter(
          (item) => !newIds.has(item.artistId || item.trackId),
        );
        return { toAdd, toRemove };
      };

      const allTimeArtistsDiff = computeDifference(
        existingFavoritesArtists.filter(
          (fav) => fav.favoriteType === "ALL_TIME_ARTIST",
        ),
        allTimeArtists,
      );
      const currentArtistsDiff = computeDifference(
        existingFavoritesArtists.filter(
          (fav) => fav.favoriteType === "CURRENT_ARTIST",
        ),
        currentArtists,
      );
      const allTimeTracksDiff = computeDifference(
        existingFavoritesTracks.filter(
          (fav) => fav.favoriteType === "ALL_TIME_TRACK",
        ),
        allTimeTracks,
      );
      const currentTracksDiff = computeDifference(
        existingFavoritesTracks.filter(
          (fav) => fav.favoriteType === "CURRENT_TRACK",
        ),
        currentTracks,
      );

      const upsertArtist = async (artist) => {
        return prisma.artist.upsert({
          where: { id: artist.id },
          update: {
            name: artist.name,
            imageUrl: artist.imageUrl,
            followers: artist.followers,
          },
          create: {
            id: artist.id,
            name: artist.name,
            imageUrl: artist.imageUrl,
            followers: artist.followers,
          },
        });
      };

      const upsertTrack = async (track) => {
        return prisma.track.upsert({
          where: { id: track.id },
          update: {
            name: track.name,
            albumImageUrl: track.albumImageUrl,
            artistNames: track.artists.map((a) => a.name).join(", "),
            popularity: track.popularity,
          },
          create: {
            id: track.id,
            name: track.name,
            albumImageUrl: track.albumImageUrl,
            artistNames: track.artists.map((a) => a.name).join(", "),
            popularity: track.popularity,
          },
        });
      };

      const upsertUserFavorite = async (
        userId,
        item,
        isArtist,
        favoriteType,
      ) => {
        const favoriteModel = isArtist
          ? prisma.userFavoriteArtists
          : prisma.userFavoriteTracks;
        const rankingModel = isArtist
          ? prisma.artistRanking
          : prisma.trackRanking;
        const idField = isArtist ? "artistId" : "trackId";
        await favoriteModel.upsert({
          where: {
            [`userId_${idField}_favoriteType`]: {
              userId,
              [idField]: item.id,
              favoriteType,
            },
          },
          update: {},
          create: {
            userId,
            [idField]: item.id,
            favoriteType,
          },
        });

        const rankingType = favoriteType;
        await rankingModel.upsert({
          where: {
            [`${idField}_rankingType`]: {
              [idField]: item.id,
              rankingType,
            },
          },
          update: {
            count: { increment: 1 },
            ...(isArtist
              ? { followers: item.followers }
              : { popularity: item.popularity }),
          },
          create: {
            [idField]: item.id,
            rankingType,
            count: 1,
            ...(isArtist
              ? { followers: item.followers }
              : { popularity: item.popularity }),
          },
        });
      };

      const removeUserFavorite = async (
        userId,
        item,
        isArtist,
        favoriteType,
      ) => {
        const favoriteModel = isArtist
          ? prisma.userFavoriteArtists
          : prisma.userFavoriteTracks;
        const rankingModel = isArtist
          ? prisma.artistRanking
          : prisma.trackRanking;
        const idField = isArtist ? "artistId" : "trackId";

        // Remove favorite
        await favoriteModel.deleteMany({
          where: {
            userId,
            [idField]: item[idField],
            favoriteType,
          },
        });

        // Decrement the ranking count
        const updatedRanking = await rankingModel.update({
          where: {
            [`${idField}_rankingType`]: {
              [idField]: item[idField],
              rankingType: favoriteType,
            },
          },
          data: { count: { decrement: 1 } },
        });

        // If count becomes 0, delete the ranking entry
        if (updatedRanking.count <= 0) {
          await rankingModel.delete({
            where: {
              [`${idField}_rankingType`]: {
                [idField]: item[idField],
                rankingType: favoriteType,
              },
            },
          });
        }
      };

      await Promise.all([
        ...allTimeArtistsDiff.toAdd.map((artist) =>
          upsertArtist(artist).then(() =>
            upsertUserFavorite(userId, artist, true, "ALL_TIME_ARTIST"),
          ),
        ),
        ...currentArtistsDiff.toAdd.map((artist) =>
          upsertArtist(artist).then(() =>
            upsertUserFavorite(userId, artist, true, "CURRENT_ARTIST"),
          ),
        ),
        ...allTimeTracksDiff.toAdd.map((track) =>
          upsertTrack(track).then(() =>
            upsertUserFavorite(userId, track, false, "ALL_TIME_TRACK"),
          ),
        ),
        ...currentTracksDiff.toAdd.map((track) =>
          upsertTrack(track).then(() =>
            upsertUserFavorite(userId, track, false, "CURRENT_TRACK"),
          ),
        ),
      ]);

      await Promise.all([
        ...allTimeArtistsDiff.toRemove.map((artist) =>
          removeUserFavorite(userId, artist, true, "ALL_TIME_ARTIST"),
        ),
        ...currentArtistsDiff.toRemove.map((artist) =>
          removeUserFavorite(userId, artist, true, "CURRENT_ARTIST"),
        ),
        ...allTimeTracksDiff.toRemove.map((track) =>
          removeUserFavorite(userId, track, false, "ALL_TIME_TRACK"),
        ),
        ...currentTracksDiff.toRemove.map((track) =>
          removeUserFavorite(userId, track, false, "CURRENT_TRACK"),
        ),
      ]);
    });

    res.status(200).json({ message: "Favorites updated successfully" });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
