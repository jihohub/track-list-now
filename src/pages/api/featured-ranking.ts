import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const allTimeArtistsRanking =
          await prisma.allTimeFavoriteArtistsRanking.findMany({
            orderBy: [{ count: "desc" }, { followers: "desc" }],
            take: 3,
          });

        const allTimeTracksRanking =
          await prisma.allTimeFavoriteTracksRanking.findMany({
            orderBy: [{ count: "desc" }, { popularity: "desc" }],
            take: 3,
          });

        const currentArtistsRanking =
          await prisma.currentFavoriteArtistsRanking.findMany({
            orderBy: [{ count: "desc" }, { followers: "desc" }],
            take: 3,
          });

        const currentTracksRanking =
          await prisma.currentFavoriteTracksRanking.findMany({
            orderBy: [{ count: "desc" }, { popularity: "desc" }],
            take: 3,
          });

        return res.status(200).json({
          allTimeArtistsRanking,
          allTimeTracksRanking,
          currentArtistsRanking,
          currentTracksRanking,
        });
      }
      default:
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
