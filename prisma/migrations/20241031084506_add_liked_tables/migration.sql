-- CreateTable
CREATE TABLE "UserLikedArtist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLikedArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLikedTrack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLikedTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLikedAlbum" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLikedAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "albumId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "albumImageUrl" TEXT NOT NULL,
    "artists" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_artist_liked_idx" ON "UserLikedArtist"("userId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikedArtist_userId_artistId_key" ON "UserLikedArtist"("userId", "artistId");

-- CreateIndex
CREATE INDEX "user_track_liked_idx" ON "UserLikedTrack"("userId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikedTrack_userId_trackId_key" ON "UserLikedTrack"("userId", "trackId");

-- CreateIndex
CREATE INDEX "user_album_liked_idx" ON "UserLikedAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikedAlbum_userId_albumId_key" ON "UserLikedAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_albumId_key" ON "Album"("albumId");

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedTrack" ADD CONSTRAINT "UserLikedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedTrack" ADD CONSTRAINT "UserLikedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedAlbum" ADD CONSTRAINT "UserLikedAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedAlbum" ADD CONSTRAINT "UserLikedAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;
