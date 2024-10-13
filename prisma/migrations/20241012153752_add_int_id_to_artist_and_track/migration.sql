/*
  Warnings:

  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Artist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[artistId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistId` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArtistRanking" DROP CONSTRAINT "ArtistRanking_artistId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRanking" DROP CONSTRAINT "TrackRanking_trackId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteArtists" DROP CONSTRAINT "UserFavoriteArtists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteTracks" DROP CONSTRAINT "UserFavoriteTracks_trackId_fkey";

-- AlterTable
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_pkey",
ADD COLUMN     "artistId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
ADD COLUMN     "trackId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_artistId_key" ON "Artist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_trackId_key" ON "Track"("trackId");

-- AddForeignKey
ALTER TABLE "UserFavoriteArtists" ADD CONSTRAINT "UserFavoriteArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteTracks" ADD CONSTRAINT "UserFavoriteTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRanking" ADD CONSTRAINT "ArtistRanking_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRanking" ADD CONSTRAINT "TrackRanking_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;
