-- CreateTable
CREATE TABLE "AllTimeFavoriteArtistsRanking" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllTimeFavoriteArtistsRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllTimeFavoriteTracksRanking" (
    "id" SERIAL NOT NULL,
    "trackId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllTimeFavoriteTracksRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentFavoriteArtistsRanking" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentFavoriteArtistsRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentFavoriteTracksRanking" (
    "id" SERIAL NOT NULL,
    "trackId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentFavoriteTracksRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AllTimeFavoriteArtistsRanking_count_followers_idx" ON "AllTimeFavoriteArtistsRanking"("count", "followers");

-- CreateIndex
CREATE INDEX "AllTimeFavoriteTracksRanking_count_popularity_idx" ON "AllTimeFavoriteTracksRanking"("count", "popularity");

-- CreateIndex
CREATE INDEX "CurrentFavoriteArtistsRanking_count_followers_idx" ON "CurrentFavoriteArtistsRanking"("count", "followers");

-- CreateIndex
CREATE INDEX "CurrentFavoriteTracksRanking_count_popularity_idx" ON "CurrentFavoriteTracksRanking"("count", "popularity");
