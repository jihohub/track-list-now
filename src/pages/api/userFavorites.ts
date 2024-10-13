import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

interface UpdateFavorites {
  userId: number;
  allTimeArtists: {
    artistId: string;
    name: string;
    imageUrl: string;
    followers: number;
  }[];
  allTimeTracks: {
    trackId: string;
    name: string;
    albumImageUrl: string;
    artists: { name: string }[];
    popularity: number;
  }[];
  currentArtists: {
    artistId: string;
    name: string;
    imageUrl: string;
    followers: number;
  }[];
  currentTracks: {
    trackId: string;
    name: string;
    albumImageUrl: string;
    artists: { name: string }[];
    popularity: number;
  }[];
}

interface UserFavoriteArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface UserFavoriteTrack {
  trackId: string;
  name: string;
  albumImageUrl: string;
  artists: { name: string }[];
  popularity: number;
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  const parsedUserId = parseInt(userId, 10);

  if (Number.isNaN(parsedUserId)) {
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
        artistId: fav.artist.artistId,
        name: fav.artist.name,
        imageUrl: fav.artist.imageUrl,
        followers: fav.artist.followers,
      }));

    const currentArtists = userFavoriteArtists
      .filter((fav) => fav.favoriteType === "CURRENT_ARTIST")
      .map((fav) => ({
        artistId: fav.artist.artistId,
        name: fav.artist.name,
        imageUrl: fav.artist.imageUrl,
        followers: fav.artist.followers,
      }));

    const allTimeTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === "ALL_TIME_TRACK")
      .map((fav) => ({
        trackId: fav.track.trackId,
        name: fav.track.name,
        albumImageUrl: fav.track.albumImageUrl,
        artists: fav.track.artists.split(", ").map((name) => ({ name })),
        popularity: fav.track.popularity,
      }));

    const currentTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === "CURRENT_TRACK")
      .map((fav) => ({
        trackId: fav.track.trackId,
        name: fav.track.name,
        albumImageUrl: fav.track.albumImageUrl,
        artists: fav.track.artists.split(", ").map((name) => ({ name })),
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
    return res.status(500).json({ error: error.message });
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
    await prisma.$transaction(async (prismaTransaction) => {
      const existingFavoritesArtists =
        await prismaTransaction.userFavoriteArtists.findMany({
          where: { userId },
        });
      const existingFavoritesTracks =
        await prismaTransaction.userFavoriteTracks.findMany({
          where: { userId },
        });

      const computeDifference = (
        existing: UserFavoriteArtist[] | UserFavoriteTrack[],
        newItems: UserFavoriteArtist[] | UserFavoriteTrack[],
      ) => {
        const existingIds = new Set(
          existing.map(
            (item) =>
              (item as UserFavoriteArtist).artistId ||
              (item as UserFavoriteTrack).trackId,
          ),
        );
        const newIds = new Set(
          newItems.map(
            (item) =>
              (item as UserFavoriteArtist).artistId ||
              (item as UserFavoriteTrack).trackId,
          ),
        );
        const toAdd = newItems.filter(
          (item) =>
            !existingIds.has(
              (item as UserFavoriteArtist).artistId ||
                (item as UserFavoriteTrack).trackId,
            ),
        );
        const toRemove = existing.filter(
          (item) =>
            !newIds.has(
              (item as UserFavoriteArtist).artistId ||
                (item as UserFavoriteTrack).trackId,
            ),
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

      const upsertArtists = async (artists: UserFavoriteArtist[]) => {
        const upsertPromises = artists.map((artist) =>
          prismaTransaction.artist.upsert({
            where: { artistId: artist.artistId },
            update: {
              name: artist.name,
              imageUrl: artist.imageUrl,
              followers: artist.followers,
            },
            create: {
              artistId: artist.artistId,
              name: artist.name,
              imageUrl: artist.imageUrl,
              followers: artist.followers,
            },
          }),
        );
        await Promise.all(upsertPromises);
      };

      const upsertTracks = async (tracks: UserFavoriteTrack[]) => {
        const upsertPromises = tracks.map((track) =>
          prismaTransaction.track.upsert({
            where: { trackId: track.trackId },
            update: {
              name: track.name,
              albumImageUrl: track.albumImageUrl,
              artists: track.artists.map((a) => a.name).join(", "),
              popularity: track.popularity,
            },
            create: {
              trackId: track.trackId,
              name: track.name,
              albumImageUrl: track.albumImageUrl,
              artists: track.artists.map((a) => a.name).join(", "),
              popularity: track.popularity,
            },
          }),
        );
        await Promise.all(upsertPromises);
      };

      await upsertArtists([
        ...allTimeArtistsDiff.toAdd,
        ...currentArtistsDiff.toAdd,
      ]);
      await upsertTracks([
        ...allTimeTracksDiff.toAdd,
        ...currentTracksDiff.toAdd,
      ]);

      const addUserFavorites = async (
        favorites: UserFavoriteArtist[] | UserFavoriteTrack[],
        isArtist: boolean,
        favoriteType,
      ) => {
        const createPromises = favorites.map(async (item) => {
          if (isArtist) {
            // 아티스트 즐겨찾기 추가
            await prismaTransaction.userFavoriteArtists.upsert({
              where: {
                userId_artistId_favoriteType: {
                  userId,
                  artistId: (item as UserFavoriteArtist).artistId,
                  favoriteType,
                },
              },
              update: {},
              create: {
                userId,
                artistId: (item as UserFavoriteArtist).artistId,
                favoriteType,
              },
            });

            // 아티스트 랭킹 업데이트
            await prismaTransaction.artistRanking.upsert({
              where: {
                artistId_rankingType: {
                  artistId: (item as UserFavoriteArtist).artistId,
                  rankingType: favoriteType as ArtistRankingType,
                },
              },
              update: {
                count: { increment: 1 },
                followers: (item as UserFavoriteArtist).followers,
              },
              create: {
                artistId: (item as UserFavoriteArtist).artistId,
                rankingType: favoriteType as ArtistRankingType,
                count: 1,
                followers: (item as UserFavoriteArtist).followers,
              },
            });
          } else {
            // 트랙 즐겨찾기 추가
            await prismaTransaction.userFavoriteTracks.upsert({
              where: {
                userId_trackId_favoriteType: {
                  userId,
                  trackId: (item as UserFavoriteTrack).trackId,
                  favoriteType,
                },
              },
              update: {},
              create: {
                userId,
                trackId: (item as UserFavoriteTrack).trackId,
                favoriteType,
              },
            });

            // 트랙 랭킹 업데이트
            await prismaTransaction.trackRanking.upsert({
              where: {
                trackId_rankingType: {
                  trackId: (item as UserFavoriteTrack).trackId,
                  rankingType: favoriteType as TrackRankingType,
                },
              },
              update: {
                count: { increment: 1 },
                popularity: (item as UserFavoriteTrack).popularity,
              },
              create: {
                trackId: (item as UserFavoriteTrack).trackId,
                rankingType: favoriteType as TrackRankingType,
                count: 1,
                popularity: (item as UserFavoriteTrack).popularity,
              },
            });
          }
        });

        await Promise.all(createPromises);
      };

      const removeUserFavorites = async (
        favorites: UserFavoriteArtist[] | UserFavoriteTrack[],
        isArtist: boolean,
        favoriteType,
      ) => {
        const deletePromises = favorites.map(async (item) => {
          if (isArtist) {
            // 아티스트 즐겨찾기 제거
            await prismaTransaction.userFavoriteArtists.deleteMany({
              where: {
                userId,
                artistId: (item as UserFavoriteArtist).artistId,
                favoriteType,
              },
            });

            // 아티스트 랭킹 업데이트
            const updatedRanking = await prismaTransaction.artistRanking.update(
              {
                where: {
                  artistId_rankingType: {
                    artistId: (item as UserFavoriteArtist).artistId,
                    rankingType: favoriteType as ArtistRankingType,
                  },
                },
                data: { count: { decrement: 1 } },
              },
            );

            if (updatedRanking.count <= 0) {
              await prismaTransaction.artistRanking.delete({
                where: {
                  artistId_rankingType: {
                    artistId: (item as UserFavoriteArtist).artistId,
                    rankingType: favoriteType as ArtistRankingType,
                  },
                },
              });
            }
          } else {
            // 트랙 즐겨찾기 제거
            await prismaTransaction.userFavoriteTracks.deleteMany({
              where: {
                userId,
                trackId: (item as UserFavoriteTrack).trackId,
                favoriteType,
              },
            });

            // 트랙 랭킹 업데이트
            const updatedRanking = await prismaTransaction.trackRanking.update({
              where: {
                trackId_rankingType: {
                  trackId: (item as UserFavoriteTrack).trackId,
                  rankingType: favoriteType as TrackRankingType,
                },
              },
              data: { count: { decrement: 1 } },
            });

            if (updatedRanking.count <= 0) {
              await prismaTransaction.trackRanking.delete({
                where: {
                  trackId_rankingType: {
                    trackId: (item as UserFavoriteTrack).trackId,
                    rankingType: favoriteType as TrackRankingType,
                  },
                },
              });
            }
          }
        });

        await Promise.all(deletePromises);
      };

      await Promise.all([
        addUserFavorites(allTimeArtistsDiff.toAdd, true, "ALL_TIME_ARTIST"),
        addUserFavorites(currentArtistsDiff.toAdd, true, "CURRENT_ARTIST"),
        addUserFavorites(allTimeTracksDiff.toAdd, false, "ALL_TIME_TRACK"),
        addUserFavorites(currentTracksDiff.toAdd, false, "CURRENT_TRACK"),
      ]);

      await Promise.all([
        removeUserFavorites(
          allTimeArtistsDiff.toRemove,
          true,
          "ALL_TIME_ARTIST",
        ),
        removeUserFavorites(
          currentArtistsDiff.toRemove,
          true,
          "CURRENT_ARTIST",
        ),
        removeUserFavorites(
          allTimeTracksDiff.toRemove,
          false,
          "ALL_TIME_TRACK",
        ),
        removeUserFavorites(currentTracksDiff.toRemove, false, "CURRENT_TRACK"),
      ]);
    });

    return res.status(200).json({ message: "Favorites updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "PATCH":
      return handlePatch(req, res);
    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
