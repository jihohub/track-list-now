import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const users = await prisma.user.findMany();
  const userFavorites = await prisma.userFavorites.findMany();
  const allTimeFavoriteArtistsRanking =
    await prisma.allTimeFavoriteArtistsRanking.findMany();
  res.status(200).json({ users, userFavorites, allTimeFavoriteArtistsRanking });
}
