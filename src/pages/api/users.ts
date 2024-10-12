import prisma from "@/libs/prisma/prismaClient";

export default async function handler(req, res) {
  const users = await prisma.user.findMany();
  const artistRanking = await prisma.artistRanking.findMany();
  const trackRanking = await prisma.trackRanking.findMany();
  const userFavoriteArtists = await prisma.userFavoriteArtists.findMany();
  const userFavoriteTracks = await prisma.userFavoriteTracks.findMany();
  const artist = await prisma.artist.findMany();
  const track = await prisma.track.findMany();
  res.status(200).json({
    users,
    artistRanking,
    trackRanking,
    userFavoriteArtists,
    userFavoriteTracks,
    artist,
    track,
  });
}
