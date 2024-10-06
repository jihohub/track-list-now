import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    await prisma.userFavorites.deleteMany({});
    await prisma.allTimeFavoriteArtistsRanking.deleteMany({});
    await prisma.allTimeFavoriteTracksRanking.deleteMany({});
    await prisma.currentFavoriteArtistsRanking.deleteMany({});
    await prisma.currentFavoriteTracksRanking.deleteMany({});

    res.status(200).json({ message: "모든 데이터를 삭제했습니다." });
  } catch (error) {
    console.error("데이터 삭제 실패:", error);
    res.status(500).json({ error: "데이터 삭제 중 오류가 발생했습니다." });
  }
}
