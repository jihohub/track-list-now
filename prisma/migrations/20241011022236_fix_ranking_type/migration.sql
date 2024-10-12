/*
  Warnings:

  - Changed the type of `rankingType` on the `ArtistRanking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rankingType` on the `TrackRanking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ArtistRankingType" AS ENUM ('ALL_TIME_ARTIST', 'CURRENT_ARTIST');

-- CreateEnum
CREATE TYPE "TrackRankingType" AS ENUM ('ALL_TIME_TRACK', 'CURRENT_TRACK');

-- AlterTable
ALTER TABLE "ArtistRanking" DROP COLUMN "rankingType",
ADD COLUMN     "rankingType" "ArtistRankingType" NOT NULL;

-- AlterTable
ALTER TABLE "TrackRanking" DROP COLUMN "rankingType",
ADD COLUMN     "rankingType" "TrackRankingType" NOT NULL;

-- DropEnum
DROP TYPE "RankingType";

-- CreateIndex
CREATE INDEX "ArtistRanking_rankingType_count_followers_idx" ON "ArtistRanking"("rankingType", "count", "followers");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistRanking_artistId_rankingType_key" ON "ArtistRanking"("artistId", "rankingType");

-- CreateIndex
CREATE INDEX "TrackRanking_rankingType_count_popularity_idx" ON "TrackRanking"("rankingType", "count", "popularity");

-- CreateIndex
CREATE UNIQUE INDEX "TrackRanking_trackId_rankingType_key" ON "TrackRanking"("trackId", "rankingType");
