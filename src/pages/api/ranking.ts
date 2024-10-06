import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { category } = req.query;

  try {
    switch (method) {
      case "GET": {
        let rankingData;

        switch (category) {
          case "atfArtists":
            rankingData = await prisma.allTimeFavoriteArtistsRanking.findMany({
              orderBy: [{ count: "desc" }, { followers: "desc" }],
              take: 100,
            });
            break;

          case "atfTracks":
            rankingData = await prisma.allTimeFavoriteTracksRanking.findMany({
              orderBy: [{ count: "desc" }, { popularity: "desc" }],
              take: 100,
            });
            break;

          case "cfArtists":
            rankingData = await prisma.currentFavoriteArtistsRanking.findMany({
              orderBy: [{ count: "desc" }, { followers: "desc" }],
              take: 100,
            });
            break;

          case "cfTracks":
            rankingData = await prisma.currentFavoriteTracksRanking.findMany({
              orderBy: [{ count: "desc" }, { popularity: "desc" }],
              take: 100,
            });
            break;

          default:
            return res.status(400).json({ error: "Invalid category" });
        }

        return res.status(200).json(rankingData);
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
