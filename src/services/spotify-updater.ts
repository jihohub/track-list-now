import ErrorProcessor from "@/libs/utils/errorProcessor";
import { AppError } from "@/types/error";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

interface ArtistUpdateData {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  images: { url: string }[];
}

interface TrackUpdateData {
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
}

export class SpotifyDataUpdater {
  private readonly BATCH_SIZE = 50;
  private readonly axiosInstance;
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: "https://api.spotify.com/v1",
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest.retry) {
          originalRequest.retry = true;

          try {
            const tokenResponse = await axios.post(`${this.baseUrl}/api/token`);
            const newAccessToken = tokenResponse.data.access_token;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (tokenError) {
            return Promise.reject(tokenError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async fetchSpotifyArtists(
    artistIds: string[],
  ): Promise<ArtistUpdateData[]> {
    try {
      const response = await this.axiosInstance.get("/artists", {
        params: { ids: artistIds.join(",") },
      });
      return response.data.artists;
    } catch (error) {
      throw new AppError("Failed to fetch artists from Spotify", {
        errorCode: "SPOTIFY_ARTIST_FETCH_FAILED",
        severity: "error",
        metadata: {
          artistIds,
          originalError: error,
        },
      });
    }
  }

  private async fetchSpotifyTracks(
    trackIds: string[],
  ): Promise<TrackUpdateData[]> {
    try {
      const response = await this.axiosInstance.get("/tracks", {
        params: {
          ids: trackIds.join(","),
          market: "US",
        },
      });
      return response.data.tracks;
    } catch (error) {
      throw new AppError("Failed to fetch tracks from Spotify", {
        errorCode: "SPOTIFY_TRACK_FETCH_FAILED",
        severity: "error",
        metadata: {
          trackIds,
          originalError: error,
        },
      });
    }
  }

  private async updateArtistBatch(artists: ArtistUpdateData[]): Promise<void> {
    try {
      const updates = artists.map((artist) =>
        prisma.artist.update({
          where: { artistId: artist.id },
          data: {
            imageUrl: artist.images[0].url,
            followers: artist.followers.total,
            updatedAt: new Date(),
          },
        }),
      );
      await prisma.$transaction(updates);
    } catch (error) {
      throw new AppError("Failed to update artist batch", {
        errorCode: "ARTIST_BATCH_UPDATE_FAILED",
        severity: "error",
        metadata: {
          artistCount: artists.length,
          artistIds: artists.map((a) => a.id),
          originalError: error,
        },
      });
    }
  }

  private async updateTrackBatch(tracks: TrackUpdateData[]): Promise<void> {
    try {
      const updates = tracks.map((track) =>
        prisma.track.update({
          where: { trackId: track.id },
          data: {
            popularity: track.popularity,
            previewUrl: track.preview_url,
            updatedAt: new Date(),
          },
        }),
      );
      await prisma.$transaction(updates);
    } catch (error) {
      throw new AppError("Failed to update track batch", {
        errorCode: "TRACK_BATCH_UPDATE_FAILED",
        severity: "error",
        metadata: {
          trackCount: tracks.length,
          trackIds: tracks.map((t) => t.id),
          originalError: error,
        },
      });
    }
  }

  async updateAllArtists(): Promise<void> {
    try {
      const allArtists = await prisma.artist.findMany({
        select: { artistId: true },
      });

      for (let i = 0; i < allArtists.length; i += this.BATCH_SIZE) {
        const batch = allArtists.slice(i, i + this.BATCH_SIZE);
        const artistIds = batch.map((a) => a.artistId);

        try {
          const spotifyArtists = await this.fetchSpotifyArtists(artistIds);
          await this.updateArtistBatch(spotifyArtists);
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          ErrorProcessor.logToSentry(
            error,
            `Artist batch update failed: ${i}-${i + this.BATCH_SIZE}`,
          );
        }
      }
    } catch (error) {
      throw new AppError("Failed to update all artists", {
        errorCode: "ARTIST_UPDATE_FAILED",
        severity: "error",
        metadata: { originalError: error },
      });
    }
  }

  async updateAllTracks(): Promise<void> {
    try {
      const allTracks = await prisma.track.findMany({
        select: { trackId: true },
      });

      for (let i = 0; i < allTracks.length; i += this.BATCH_SIZE) {
        const batch = allTracks.slice(i, i + this.BATCH_SIZE);
        const trackIds = batch.map((t) => t.trackId);

        try {
          const spotifyTracks = await this.fetchSpotifyTracks(trackIds);
          await this.updateTrackBatch(spotifyTracks);
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          ErrorProcessor.logToSentry(
            error,
            `Track batch update failed: ${i}-${i + this.BATCH_SIZE}`,
          );
        }
      }
    } catch (error) {
      throw new AppError("Failed to update all tracks", {
        errorCode: "TRACK_UPDATE_FAILED",
        severity: "error",
        metadata: { originalError: error },
      });
    }
  }
}
