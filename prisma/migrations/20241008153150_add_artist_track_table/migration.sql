/*
  Warnings:

  - You are about to drop the `AllTimeFavoriteArtistsRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AllTimeFavoriteTracksRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CurrentFavoriteArtistsRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CurrentFavoriteTracksRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('ALL_TIME_ARTIST', 'ALL_TIME_TRACK', 'CURRENT_ARTIST', 'CURRENT_TRACK');

-- CreateEnum
CREATE TYPE "RankingType" AS ENUM ('ALL_TIME', 'CURRENT');

-- DropForeignKey
ALTER TABLE "UserFavorites" DROP CONSTRAINT "UserFavorites_userId_fkey";

-- DropTable
DROP TABLE "AllTimeFavoriteArtistsRanking";

-- DropTable
DROP TABLE "AllTimeFavoriteTracksRanking";

-- DropTable
DROP TABLE "CurrentFavoriteArtistsRanking";

-- DropTable
DROP TABLE "CurrentFavoriteTracksRanking";

-- DropTable
DROP TABLE "UserFavorites";

-- CreateTable
CREATE TABLE "UserFavoriteArtists" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artistId" TEXT NOT NULL,
    "favoriteType" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavoriteArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavoriteTracks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" TEXT NOT NULL,
    "favoriteType" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavoriteTracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "albumImageUrl" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistRanking" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "rankingType" "RankingType" NOT NULL,
    "count" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackRanking" (
    "id" SERIAL NOT NULL,
    "trackId" TEXT NOT NULL,
    "rankingType" "RankingType" NOT NULL,
    "count" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteArtists_userId_artistId_favoriteType_key" ON "UserFavoriteArtists"("userId", "artistId", "favoriteType");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteTracks_userId_trackId_favoriteType_key" ON "UserFavoriteTracks"("userId", "trackId", "favoriteType");

-- CreateIndex
CREATE INDEX "ArtistRanking_rankingType_count_followers_idx" ON "ArtistRanking"("rankingType", "count", "followers");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistRanking_artistId_rankingType_key" ON "ArtistRanking"("artistId", "rankingType");

-- CreateIndex
CREATE INDEX "TrackRanking_rankingType_count_popularity_idx" ON "TrackRanking"("rankingType", "count", "popularity");

-- CreateIndex
CREATE UNIQUE INDEX "TrackRanking_trackId_rankingType_key" ON "TrackRanking"("trackId", "rankingType");

-- AddForeignKey
ALTER TABLE "UserFavoriteArtists" ADD CONSTRAINT "UserFavoriteArtists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteArtists" ADD CONSTRAINT "UserFavoriteArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteTracks" ADD CONSTRAINT "UserFavoriteTracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteTracks" ADD CONSTRAINT "UserFavoriteTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRanking" ADD CONSTRAINT "ArtistRanking_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRanking" ADD CONSTRAINT "TrackRanking_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
