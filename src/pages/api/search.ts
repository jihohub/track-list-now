import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import { SpotifyArtist } from "@/types/artist";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import {
  SimplifiedArtist,
  SimplifiedSearchResponse,
  SimplifiedTrack,
  SpotifySearchResponse,
} from "@/types/search";
import { SpotifyArtistBrief, SpotifyTrack } from "@/types/track";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SimplifiedSearchResponse>,
) => {
  const { q, type } = req.query;

  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  if (
    typeof q !== "string" ||
    typeof type !== "string" ||
    !["artist", "track"].includes(type)
  ) {
    throw new ValidationError("Invalid query or type parameter");
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get<SpotifySearchResponse>("/search", {
      params: {
        q,
        type,
        limit: 50,
      },
    });

    const { data } = response;

    if (!data) {
      throw new SpotifyAPIError("Empty response from Spotify API", 502);
    }

    if (type === "artist" && "artists" in data) {
      const simplifiedArtists: SimplifiedArtist[] = data.artists.items.map(
        (artist: SpotifyArtist) => ({
          imageUrl: artist.images[0]?.url,
          name: artist.name,
          id: artist.id,
          followers: artist.followers.total,
        }),
      );

      return res.status(200).json({
        artists: {
          items: simplifiedArtists,
          href: data.artists.href,
          limit: data.artists.limit,
          next: data.artists.next,
          offset: data.artists.offset,
          previous: data.artists.previous,
          total: data.artists.total,
        },
      });
    }

    if (type === "track" && "tracks" in data) {
      const simplifiedTracks: SimplifiedTrack[] = data.tracks.items.map(
        (track: SpotifyTrack) => ({
          imageUrl: track.album.images[0]?.url,
          name: track.name,
          artists: track.artists
            .map((artist: SpotifyArtistBrief) => artist.name)
            .join(", "),
          id: track.id,
          previewUrl: track.preview_url,
          durationMs: track.duration_ms,
          popularity: track.popularity,
        }),
      );

      return res.status(200).json({
        tracks: {
          items: simplifiedTracks,
          href: data.tracks.href,
          limit: data.tracks.limit,
          next: data.tracks.next,
          offset: data.tracks.offset,
          previous: data.tracks.previous,
          total: data.tracks.total,
        },
      });
    }

    throw new SpotifyAPIError(
      "Invalid response structure from Spotify API",
      502,
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof AxiosError) {
      throw new SpotifyAPIError(
        `Spotify API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }

    throw error;
  }
};

export default withErrorHandling(handler);
