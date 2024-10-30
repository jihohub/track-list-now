import prisma from "@/libs/prisma/prismaClient";
import {
  computeDifference,
  mapFavoriteTypeToArtistRankingType,
  mapFavoriteTypeToTrackRankingType,
} from "@/libs/utils/favorite";
import {
  ResponseData,
  UpdateFavorites,
  UserFavoritesResponse,
} from "@/types/favorite";
import {
  ArtistRanking,
  FavoriteType,
  Prisma,
  TrackRanking,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
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
    const userFavoriteArtists = await prisma.userFavoriteArtist.findMany({
      where: { userId: parsedUserId },
      include: {
        artist: true,
      },
    });

    // 사용자별 즐겨찾기 트랙 조회
    const userFavoriteTracks = await prisma.userFavoriteTrack.findMany({
      where: { userId: parsedUserId },
      include: {
        track: true,
      },
    });

    const allTimeArtists = userFavoriteArtists
      .filter((fav) => fav.favoriteType === FavoriteType.ALL_TIME_ARTIST)
      .map((fav) => fav.artist);

    const currentArtists = userFavoriteArtists
      .filter((fav) => fav.favoriteType === FavoriteType.CURRENT_ARTIST)
      .map((fav) => fav.artist);

    const allTimeTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === FavoriteType.ALL_TIME_TRACK)
      .map((fav) => fav.track);

    const currentTracks = userFavoriteTracks
      .filter((fav) => fav.favoriteType === FavoriteType.CURRENT_TRACK)
      .map((fav) => fav.track);

    const userFavorites: UserFavoritesResponse = {
      allTimeArtists,
      currentArtists,
      allTimeTracks,
      currentTracks,
    };

    return res.status(200).json(userFavorites);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

// const handlePatch = async (
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>,
// ) => {
//   const {
//     userId,
//     allTimeArtists,
//     allTimeTracks,
//     currentArtists,
//     currentTracks,
//   } = req.body as UpdateFavorites;

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     await prisma.$transaction(async (prismaTransaction) => {
//       const [existingFavoritesArtists, existingFavoritesTracks] =
//         await Promise.all([
//           prismaTransaction.userFavoriteArtist.findMany({
//             where: { userId },
//           }),
//           prismaTransaction.userFavoriteTrack.findMany({
//             where: { userId },
//           }),
//         ]);

//       const allTimeArtistsDiff = computeDifference(
//         existingFavoritesArtists.filter(
//           (fav) => fav.favoriteType === FavoriteType.ALL_TIME_ARTIST,
//         ),
//         allTimeArtists,
//         "artistId",
//         "artistId",
//       );
//       const currentArtistsDiff = computeDifference(
//         existingFavoritesArtists.filter(
//           (fav) => fav.favoriteType === FavoriteType.CURRENT_ARTIST,
//         ),
//         currentArtists,
//         "artistId",
//         "artistId",
//       );
//       const allTimeTracksDiff = computeDifference(
//         existingFavoritesTracks.filter(
//           (fav) => fav.favoriteType === FavoriteType.ALL_TIME_TRACK,
//         ),
//         allTimeTracks,
//         "trackId",
//         "trackId",
//       );
//       const currentTracksDiff = computeDifference(
//         existingFavoritesTracks.filter(
//           (fav) => fav.favoriteType === FavoriteType.CURRENT_TRACK,
//         ),
//         currentTracks,
//         "trackId",
//         "trackId",
//       );

//       const upsertArtists = async (artists: UserFavoriteArtistInput[]) => {
//         const upsertPromises = artists.map((artist) =>
//           prismaTransaction.artist.upsert({
//             where: { artistId: artist.artistId },
//             update: {
//               name: artist.name,
//               imageUrl: artist.imageUrl,
//               followers: artist.followers,
//             },
//             create: {
//               artistId: artist.artistId,
//               name: artist.name,
//               imageUrl: artist.imageUrl,
//               followers: artist.followers,
//             },
//           }),
//         );
//         await Promise.all(upsertPromises);
//       };

//       const upsertTracks = async (tracks: UserFavoriteTrackInput[]) => {
//         const upsertPromises = tracks.map((track) =>
//           prismaTransaction.track.upsert({
//             where: { trackId: track.trackId },
//             update: {
//               name: track.name,
//               albumImageUrl: track.albumImageUrl,
//               artists: track.artists,
//               popularity: track.popularity,
//             },
//             create: {
//               trackId: track.trackId,
//               name: track.name,
//               albumImageUrl: track.albumImageUrl,
//               artists: track.artists,
//               popularity: track.popularity,
//             },
//           }),
//         );
//         await Promise.all(upsertPromises);
//       };

//       await upsertArtists([
//         ...allTimeArtistsDiff.toAdd,
//         ...currentArtistsDiff.toAdd,
//       ]);
//       await upsertTracks([
//         ...allTimeTracksDiff.toAdd,
//         ...currentTracksDiff.toAdd,
//       ]);

//       const addUserFavorites = async (
//         favorites: UserFavoriteArtistInput[] | UserFavoriteTrackInput[],
//         isArtist: boolean,
//         favoriteType: FavoriteType,
//       ) => {
//         const createPromises = favorites.map(async (item) => {
//           if (isArtist) {
//             // 아티스트 즐겨찾기 추가
//             const artist = item as UserFavoriteArtistInput;
//             await prismaTransaction.userFavoriteArtist.upsert({
//               where: {
//                 userId_artistId_favoriteType: {
//                   userId,
//                   artistId: artist.artistId,
//                   favoriteType,
//                 },
//               },
//               update: {},
//               create: {
//                 userId,
//                 artistId: artist.artistId,
//                 favoriteType,
//               },
//             });

//             // 아티스트 랭킹 업데이트
//             await prismaTransaction.artistRanking.upsert({
//               where: {
//                 artistId_rankingType: {
//                   artistId: artist.artistId,
//                   rankingType: mapFavoriteTypeToArtistRankingType(favoriteType),
//                 },
//               },
//               update: {
//                 count: { increment: 1 },
//                 followers: artist.followers,
//               },
//               create: {
//                 artistId: artist.artistId,
//                 rankingType: mapFavoriteTypeToArtistRankingType(favoriteType),
//                 count: 1,
//                 followers: artist.followers,
//               },
//             });
//           } else {
//             // 트랙 즐겨찾기 추가
//             const track = item as UserFavoriteTrackInput;
//             await prismaTransaction.userFavoriteTrack.upsert({
//               where: {
//                 userId_trackId_favoriteType: {
//                   userId,
//                   trackId: track.trackId,
//                   favoriteType,
//                 },
//               },
//               update: {},
//               create: {
//                 userId,
//                 trackId: track.trackId,
//                 favoriteType,
//               },
//             });

//             // 트랙 랭킹 업데이트
//             await prismaTransaction.trackRanking.upsert({
//               where: {
//                 trackId_rankingType: {
//                   trackId: track.trackId,
//                   rankingType: mapFavoriteTypeToTrackRankingType(favoriteType),
//                 },
//               },
//               update: {
//                 count: { increment: 1 },
//                 popularity: track.popularity,
//               },
//               create: {
//                 trackId: track.trackId,
//                 rankingType: mapFavoriteTypeToTrackRankingType(favoriteType),
//                 count: 1,
//                 popularity: track.popularity,
//               },
//             });
//           }
//         });

//         await Promise.all(createPromises);
//       };

//       const removeUserFavorites = async (
//         favorites: UserFavoriteArtist[] | UserFavoriteTrack[],
//         isArtist: boolean,
//         favoriteType: FavoriteType,
//       ) => {
//         const deletePromises = favorites.map(async (item) => {
//           if (isArtist) {
//             // 아티스트 즐겨찾기 제거
//             const artist = item as UserFavoriteArtist;
//             await prismaTransaction.userFavoriteArtist.deleteMany({
//               where: {
//                 userId,
//                 artistId: artist.artistId,
//                 favoriteType,
//               },
//             });

//             // 아티스트 랭킹 업데이트
//             const updatedRanking = await prismaTransaction.artistRanking.update(
//               {
//                 where: {
//                   artistId_rankingType: {
//                     artistId: artist.artistId,
//                     rankingType:
//                       mapFavoriteTypeToArtistRankingType(favoriteType),
//                   },
//                 },
//                 data: { count: { decrement: 1 } },
//               },
//             );

//             if (updatedRanking.count <= 0) {
//               await prismaTransaction.artistRanking.delete({
//                 where: {
//                   artistId_rankingType: {
//                     artistId: artist.artistId,
//                     rankingType:
//                       mapFavoriteTypeToArtistRankingType(favoriteType),
//                   },
//                 },
//               });
//             }
//           } else {
//             // 트랙 즐겨찾기 제거
//             const track = item as UserFavoriteTrack;
//             await prismaTransaction.userFavoriteTrack.deleteMany({
//               where: {
//                 userId,
//                 trackId: track.trackId,
//                 favoriteType,
//               },
//             });

//             // 트랙 랭킹 업데이트
//             const updatedRanking = await prismaTransaction.trackRanking.update({
//               where: {
//                 trackId_rankingType: {
//                   trackId: track.trackId,
//                   rankingType: mapFavoriteTypeToTrackRankingType(favoriteType),
//                 },
//               },
//               data: { count: { decrement: 1 } },
//             });

//             if (updatedRanking.count <= 0) {
//               await prismaTransaction.trackRanking.delete({
//                 where: {
//                   trackId_rankingType: {
//                     trackId: track.trackId,
//                     rankingType:
//                       mapFavoriteTypeToTrackRankingType(favoriteType),
//                   },
//                 },
//               });
//             }
//           }
//         });

//         await Promise.all(deletePromises);
//       };

//       await Promise.all([
//         addUserFavorites(
//           allTimeArtistsDiff.toAdd,
//           true,
//           FavoriteType.ALL_TIME_ARTIST,
//         ),
//         addUserFavorites(
//           currentArtistsDiff.toAdd,
//           true,
//           FavoriteType.CURRENT_ARTIST,
//         ),
//         addUserFavorites(
//           allTimeTracksDiff.toAdd,
//           false,
//           FavoriteType.ALL_TIME_TRACK,
//         ),
//         addUserFavorites(
//           currentTracksDiff.toAdd,
//           false,
//           FavoriteType.CURRENT_TRACK,
//         ),
//       ]);

//       await Promise.all([
//         removeUserFavorites(
//           allTimeArtistsDiff.toRemove,
//           true,
//           FavoriteType.ALL_TIME_ARTIST,
//         ),
//         removeUserFavorites(
//           currentArtistsDiff.toRemove,
//           true,
//           FavoriteType.CURRENT_ARTIST,
//         ),
//         removeUserFavorites(
//           allTimeTracksDiff.toRemove,
//           false,
//           FavoriteType.ALL_TIME_TRACK,
//         ),
//         removeUserFavorites(
//           currentTracksDiff.toRemove,
//           false,
//           FavoriteType.CURRENT_TRACK,
//         ),
//       ]);
//     });

//     return res.status(200).json({ message: "Favorites updated successfully" });
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "알 수 없는 오류가 발생했습니다.";
//     return res.status(500).json({ error: errorMessage });
//   }
// };

const handlePatch = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
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
      // 기존 즐겨찾기 데이터 조회
      const [existingFavoritesArtists, existingFavoritesTracks] =
        await Promise.all([
          prismaTransaction.userFavoriteArtist.findMany({
            where: { userId },
          }),
          prismaTransaction.userFavoriteTrack.findMany({
            where: { userId },
          }),
        ]);

      // 차이 계산
      const allTimeArtistsDiff = computeDifference(
        existingFavoritesArtists.filter(
          (fav) => fav.favoriteType === FavoriteType.ALL_TIME_ARTIST,
        ),
        allTimeArtists,
        "artistId",
        "artistId",
      );
      const currentArtistsDiff = computeDifference(
        existingFavoritesArtists.filter(
          (fav) => fav.favoriteType === FavoriteType.CURRENT_ARTIST,
        ),
        currentArtists,
        "artistId",
        "artistId",
      );
      const allTimeTracksDiff = computeDifference(
        existingFavoritesTracks.filter(
          (fav) => fav.favoriteType === FavoriteType.ALL_TIME_TRACK,
        ),
        allTimeTracks,
        "trackId",
        "trackId",
      );
      const currentTracksDiff = computeDifference(
        existingFavoritesTracks.filter(
          (fav) => fav.favoriteType === FavoriteType.CURRENT_TRACK,
        ),
        currentTracks,
        "trackId",
        "trackId",
      );

      // 아티스트 및 트랙 업서트 (배치 작업)
      const uniqueArtistsToAdd = [
        ...allTimeArtistsDiff.toAdd,
        ...currentArtistsDiff.toAdd,
      ];

      const uniqueTracksToAdd = [
        ...allTimeTracksDiff.toAdd,
        ...currentTracksDiff.toAdd,
      ];

      // 아티스트 배치 추가
      if (uniqueArtistsToAdd.length > 0) {
        const artistData = uniqueArtistsToAdd.map((artist) => ({
          artistId: artist.artistId,
          name: artist.name,
          imageUrl: artist.imageUrl,
          followers: artist.followers,
        }));

        await prismaTransaction.artist.createMany({
          data: artistData,
          skipDuplicates: true,
        });
      }

      // 트랙 배치 추가
      if (uniqueTracksToAdd.length > 0) {
        const trackData = uniqueTracksToAdd.map((track) => ({
          trackId: track.trackId,
          name: track.name,
          albumImageUrl: track.albumImageUrl,
          artists: track.artists,
          popularity: track.popularity,
        }));

        await prismaTransaction.track.createMany({
          data: trackData,
          skipDuplicates: true,
        });
      }

      // 사용자 즐겨찾기 추가 (배치 작업)
      const userFavoriteArtistsToAdd = [
        ...allTimeArtistsDiff.toAdd.map((a) => ({
          userId,
          artistId: a.artistId,
          favoriteType: FavoriteType.ALL_TIME_ARTIST,
        })),
        ...currentArtistsDiff.toAdd.map((a) => ({
          userId,
          artistId: a.artistId,
          favoriteType: FavoriteType.CURRENT_ARTIST,
        })),
      ];

      const userFavoriteTracksToAdd = [
        ...allTimeTracksDiff.toAdd.map((t) => ({
          userId,
          trackId: t.trackId,
          favoriteType: FavoriteType.ALL_TIME_TRACK,
        })),
        ...currentTracksDiff.toAdd.map((t) => ({
          userId,
          trackId: t.trackId,
          favoriteType: FavoriteType.CURRENT_TRACK,
        })),
      ];

      // 사용자 아티스트 즐겨찾기 배치 추가
      if (userFavoriteArtistsToAdd.length > 0) {
        await prismaTransaction.userFavoriteArtist.createMany({
          data: userFavoriteArtistsToAdd,
          skipDuplicates: true,
        });
      }

      // 사용자 트랙 즐겨찾기 배치 추가
      if (userFavoriteTracksToAdd.length > 0) {
        await prismaTransaction.userFavoriteTrack.createMany({
          data: userFavoriteTracksToAdd,
          skipDuplicates: true,
        });
      }

      // 랭킹 업데이트 (병렬 upsert 작업)
      const userFavoriteArtistsRankings = [
        ...allTimeArtistsDiff.toAdd.map((a) => ({
          artistId: a.artistId,
          rankingType: mapFavoriteTypeToArtistRankingType(
            FavoriteType.ALL_TIME_ARTIST,
          ),
          followers: a.followers,
        })),
        ...currentArtistsDiff.toAdd.map((a) => ({
          artistId: a.artistId,
          rankingType: mapFavoriteTypeToArtistRankingType(
            FavoriteType.CURRENT_ARTIST,
          ),
          followers: a.followers,
        })),
      ];

      const userFavoriteTracksRankings = [
        ...allTimeTracksDiff.toAdd.map((t) => ({
          trackId: t.trackId,
          rankingType: mapFavoriteTypeToTrackRankingType(
            FavoriteType.ALL_TIME_TRACK,
          ),
          popularity: t.popularity,
        })),
        ...currentTracksDiff.toAdd.map((t) => ({
          trackId: t.trackId,
          rankingType: mapFavoriteTypeToTrackRankingType(
            FavoriteType.CURRENT_TRACK,
          ),
          popularity: t.popularity,
        })),
      ];

      // 아티스트 랭킹 업데이트
      const artistRankingPromises: Promise<ArtistRanking>[] =
        userFavoriteArtistsRankings.map((artist) =>
          prismaTransaction.artistRanking.upsert({
            where: {
              artistId_rankingType: {
                artistId: artist.artistId,
                rankingType: artist.rankingType,
              },
            },
            update: {
              count: { increment: 1 },
              followers: artist.followers,
            },
            create: {
              artistId: artist.artistId,
              rankingType: artist.rankingType,
              count: 1,
              followers: artist.followers,
            },
          }),
        );

      // 트랙 랭킹 업데이트
      const trackRankingPromises: Promise<TrackRanking>[] =
        userFavoriteTracksRankings.map((track) =>
          prismaTransaction.trackRanking.upsert({
            where: {
              trackId_rankingType: {
                trackId: track.trackId,
                rankingType: track.rankingType,
              },
            },
            update: {
              count: { increment: 1 },
              popularity: track.popularity,
            },
            create: {
              trackId: track.trackId,
              rankingType: track.rankingType,
              count: 1,
              popularity: track.popularity,
            },
          }),
        );

      const rankingPromises: Promise<ArtistRanking | TrackRanking>[] = [
        ...artistRankingPromises,
        ...trackRankingPromises,
      ];

      await Promise.all(rankingPromises);

      // 사용자 즐겨찾기 제거 (배치 작업)
      const userFavoriteArtistsToRemove = [
        ...allTimeArtistsDiff.toRemove.map((a) => ({
          artistId: a.artistId,
          rankingType: FavoriteType.ALL_TIME_ARTIST,
        })),
        ...currentArtistsDiff.toRemove.map((a) => ({
          artistId: a.artistId,
          rankingType: FavoriteType.CURRENT_ARTIST,
        })),
      ];

      const userFavoriteTracksToRemove = [
        ...allTimeTracksDiff.toRemove.map((t) => ({
          trackId: t.trackId,
          rankingType: FavoriteType.ALL_TIME_TRACK,
        })),
        ...currentTracksDiff.toRemove.map((t) => ({
          trackId: t.trackId,
          rankingType: FavoriteType.CURRENT_TRACK,
        })),
      ];

      // 사용자 아티스트 즐겨찾기 배치 제거
      if (userFavoriteArtistsToRemove.length > 0) {
        await prismaTransaction.userFavoriteArtist.deleteMany({
          where: {
            userId,
            artistId: {
              in: userFavoriteArtistsToRemove.map((a) => a.artistId),
            },
            favoriteType: {
              in: [FavoriteType.ALL_TIME_ARTIST, FavoriteType.CURRENT_ARTIST],
            },
          },
        });
      }

      // 사용자 트랙 즐겨찾기 배치 제거
      if (userFavoriteTracksToRemove.length > 0) {
        await prismaTransaction.userFavoriteTrack.deleteMany({
          where: {
            userId,
            trackId: { in: userFavoriteTracksToRemove.map((t) => t.trackId) },
            favoriteType: {
              in: [FavoriteType.ALL_TIME_TRACK, FavoriteType.CURRENT_TRACK],
            },
          },
        });
      }

      // 랭킹 업데이트 (배치 작업)
      const userFavoriteArtistsRankingsRemove = userFavoriteArtistsToRemove.map(
        (a) => ({
          artistId: a.artistId,
          rankingType: mapFavoriteTypeToArtistRankingType(a.rankingType),
        }),
      );

      const userFavoriteTracksRankingsRemove = userFavoriteTracksToRemove.map(
        (t) => ({
          trackId: t.trackId,
          rankingType: mapFavoriteTypeToTrackRankingType(t.rankingType),
        }),
      );

      // 아티스트 랭킹 제거 프로미스 생성
      const artistRankingRemovePromises: Promise<Prisma.BatchPayload>[] =
        userFavoriteArtistsRankingsRemove.flatMap((a) => [
          prismaTransaction.artistRanking.updateMany({
            where: {
              artistId: a.artistId,
              rankingType: a.rankingType,
            },
            data: {
              count: { decrement: 1 },
            },
          }),
          prismaTransaction.artistRanking.deleteMany({
            where: {
              artistId: a.artistId,
              rankingType: a.rankingType,
              count: { lte: 0 },
            },
          }),
        ]);

      // 트랙 랭킹 제거 프로미스 생성
      const trackRankingRemovePromises: Promise<Prisma.BatchPayload>[] =
        userFavoriteTracksRankingsRemove.flatMap((t) => [
          prismaTransaction.trackRanking.updateMany({
            where: {
              trackId: t.trackId,
              rankingType: t.rankingType,
            },
            data: {
              count: { decrement: 1 },
            },
          }),
          prismaTransaction.trackRanking.deleteMany({
            where: {
              trackId: t.trackId,
              rankingType: t.rankingType,
              count: { lte: 0 },
            },
          }),
        ]);

      // 모든 랭킹 제거 작업을 병렬로 실행
      const rankingRemovePromises: Promise<Prisma.BatchPayload>[] = [
        ...artistRankingRemovePromises,
        ...trackRankingRemovePromises,
      ];

      await Promise.all(rankingRemovePromises);
    });

    return res.status(200).json({ message: "Favorites updated successfully" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
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
