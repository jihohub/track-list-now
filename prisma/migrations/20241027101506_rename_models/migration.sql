/*
  Warnings:

  - You are about to drop the `UserFavoriteArtists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteTracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFavoriteArtists" DROP CONSTRAINT "UserFavoriteArtists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteArtists" DROP CONSTRAINT "UserFavoriteArtists_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteTracks" DROP CONSTRAINT "UserFavoriteTracks_trackId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteTracks" DROP CONSTRAINT "UserFavoriteTracks_userId_fkey";

-- DropTable
DROP TABLE "UserFavoriteArtists";

-- DropTable
DROP TABLE "UserFavoriteTracks";

-- CreateTable
CREATE TABLE "UserFavoriteArtist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artistId" TEXT NOT NULL,
    "favoriteType" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavoriteArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavoriteTrack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" TEXT NOT NULL,
    "favoriteType" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavoriteTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_artist_idx" ON "UserFavoriteArtist"("userId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteArtist_userId_artistId_favoriteType_key" ON "UserFavoriteArtist"("userId", "artistId", "favoriteType");

-- CreateIndex
CREATE INDEX "user_track_idx" ON "UserFavoriteTrack"("userId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteTrack_userId_trackId_favoriteType_key" ON "UserFavoriteTrack"("userId", "trackId", "favoriteType");

-- AddForeignKey
ALTER TABLE "UserFavoriteArtist" ADD CONSTRAINT "UserFavoriteArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteArtist" ADD CONSTRAINT "UserFavoriteArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteTrack" ADD CONSTRAINT "UserFavoriteTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteTrack" ADD CONSTRAINT "UserFavoriteTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;
