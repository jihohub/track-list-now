import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import {
  computeDifference,
  mapFavoriteTypeToArtistRankingType,
  mapFavoriteTypeToTrackRankingType,
} from "@/libs/utils/favorite";
import { APIError, DatabaseError, ValidationError } from "@/types/error";
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
    throw new ValidationError("Invalid or missing userId");
  }

  const parsedUserId = parseInt(userId, 10);

  if (Number.isNaN(parsedUserId)) {
    throw new ValidationError("userId must be a number");
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
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError("Failed to fetch user favorites");
  }
};

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
    throw new ValidationError("User ID is required");
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
          imageUrl: track.imageUrl,
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(`Database operation failed: ${error.message}`);
    }
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError("Failed to update favorites");
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
      throw new APIError(`Method ${method} Not Allowed`, {
        statusCode: 405,
        errorCode: "METHOD_NOT_ALLOWED",
      });
  }
};

export default withErrorHandling(handler);
