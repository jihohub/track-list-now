/*
  Warnings:

  - Changed the type of `count` on the `TrackRanking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TrackRanking" DROP COLUMN "count",
ADD COLUMN     "count" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "TrackRanking_rankingType_count_popularity_idx" ON "TrackRanking"("rankingType", "count", "popularity");
