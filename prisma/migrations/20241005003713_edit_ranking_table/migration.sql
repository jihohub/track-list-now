/*
  Warnings:

  - A unique constraint covering the columns `[artistId]` on the table `AllTimeFavoriteArtistsRanking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `AllTimeFavoriteTracksRanking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artistId]` on the table `CurrentFavoriteArtistsRanking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `CurrentFavoriteTracksRanking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AllTimeFavoriteArtistsRanking_artistId_key" ON "AllTimeFavoriteArtistsRanking"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "AllTimeFavoriteTracksRanking_trackId_key" ON "AllTimeFavoriteTracksRanking"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentFavoriteArtistsRanking_artistId_key" ON "CurrentFavoriteArtistsRanking"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentFavoriteTracksRanking_trackId_key" ON "CurrentFavoriteTracksRanking"("trackId");
