-- CreateIndex
CREATE INDEX "user_artist_idx" ON "UserFavoriteArtists"("userId", "artistId");

-- CreateIndex
CREATE INDEX "user_track_idx" ON "UserFavoriteTracks"("userId", "trackId");
