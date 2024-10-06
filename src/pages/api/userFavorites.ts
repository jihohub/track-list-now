import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const { userId } = req.query;

        if (!userId || isNaN(parseInt(userId, 10))) {
          return res.status(400).json({ error: "Invalid userId" });
        }

        const userFavorites = await prisma.userFavorites.findMany({
          where: { userId: parseInt(userId, 10) },
        });

        if (!userFavorites) {
          return res.status(404).json({ message: "No favorites found" });
        }

        return res.status(200).json(userFavorites);
      }
      case "PATCH": {
        const {
          userId,
          allTimeArtists = [],
          allTimeTracks = [],
          currentArtists = [],
          currentTracks = [],
        } = req.body;

        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId, 10) },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const existingFavorites = await prisma.userFavorites.findMany({
          where: { userId: parseInt(userId, 10) },
        });

        const existingArtistIds = existingFavorites
          .filter((fav) => fav.artistId)
          .map((fav) => fav.artistId);

        const existingTrackIds = existingFavorites
          .filter((fav) => fav.trackId)
          .map((fav) => fav.trackId);

        const itemsToRemove = existingFavorites.filter((fav) => {
          const isArtist = fav.artistId !== null;
          const isTrack = fav.trackId !== null;

          if (isArtist) {
            return (
              !allTimeArtists.includes(fav.artistId) &&
              !currentArtists.includes(fav.artistId)
            );
          }

          if (isTrack) {
            return (
              !allTimeTracks.includes(fav.trackId) &&
              !currentTracks.includes(fav.trackId)
            );
          }

          return false;
        });

        if (itemsToRemove.length > 0) {
          await prisma.userFavorites.deleteMany({
            where: {
              id: { in: itemsToRemove.map((item) => item.id) },
            },
          });

          for (const item of itemsToRemove) {
            if (item.artistId) {
              await prisma.allTimeFavoriteArtistsRanking.updateMany({
                where: { artistId: item.artistId },
                data: { count: { decrement: 1 } },
              });
              await prisma.currentFavoriteArtistsRanking.updateMany({
                where: { artistId: item.artistId },
                data: { count: { decrement: 1 } },
              });
            } else if (item.trackId) {
              await prisma.allTimeFavoriteTracksRanking.updateMany({
                where: { trackId: item.trackId },
                data: { count: { decrement: 1 } },
              });
              await prisma.currentFavoriteTracksRanking.updateMany({
                where: { trackId: item.trackId },
                data: { count: { decrement: 1 } },
              });
            }
          }
        }

        await prisma.allTimeFavoriteArtistsRanking.deleteMany({
          where: { count: { equals: 0 } },
        });
        await prisma.allTimeFavoriteTracksRanking.deleteMany({
          where: { count: { equals: 0 } },
        });
        await prisma.currentFavoriteArtistsRanking.deleteMany({
          where: { count: { equals: 0 } },
        });
        await prisma.currentFavoriteTracksRanking.deleteMany({
          where: { count: { equals: 0 } },
        });

        await prisma.userFavorites.createMany({
          data: [
            ...allTimeArtists
              .filter((artistId) => !existingArtistIds.includes(artistId))
              .map((artistId) => ({
                userId: parseInt(userId, 10),
                artistId: artistId.id,
                favoriteType: "atfArtists",
              })),
            ...allTimeTracks
              .filter((trackId) => !existingTrackIds.includes(trackId))
              .map((trackId) => ({
                userId: parseInt(userId, 10),
                trackId: trackId.id,
                favoriteType: "atfTracks",
              })),
            ...currentArtists
              .filter((artistId) => !existingArtistIds.includes(artistId))
              .map((artistId) => ({
                userId: parseInt(userId, 10),
                artistId: artistId.id,
                favoriteType: "cfArtists",
              })),
            ...currentTracks
              .filter((trackId) => !existingTrackIds.includes(trackId))
              .map((trackId) => ({
                userId: parseInt(userId, 10),
                trackId: trackId.id,
                favoriteType: "cfTracks",
              })),
          ],
        });

        for (const artist of allTimeArtists) {
          await prisma.allTimeFavoriteArtistsRanking.upsert({
            where: { artistId: artist.id },
            update: { count: { increment: 1 }, followers: artist.followers },
            create: {
              artistId: artist.id,
              count: 1,
              followers: artist.followers,
            },
          });
        }

        for (const track of allTimeTracks) {
          await prisma.allTimeFavoriteTracksRanking.upsert({
            where: { trackId: track.id },
            update: { count: { increment: 1 }, popularity: track.popularity },
            create: {
              trackId: track.id,
              count: 1,
              popularity: track.popularity,
            },
          });
        }

        for (const artist of currentArtists) {
          await prisma.currentFavoriteArtistsRanking.upsert({
            where: { artistId: artist.id },
            update: { count: { increment: 1 }, followers: artist.followers },
            create: {
              artistId: artist.id,
              count: 1,
              followers: artist.followers,
            },
          });
        }

        for (const track of currentTracks) {
          await prisma.currentFavoriteTracksRanking.upsert({
            where: { trackId: track.id },
            update: { count: { increment: 1 }, popularity: track.popularity },
            create: {
              trackId: track.id,
              count: 1,
              popularity: track.popularity,
            },
          });
        }

        return res.status(200).json({ message: "Updated successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PATCH"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
