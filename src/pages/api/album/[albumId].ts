import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import { AlbumResponseData, SimplifiedAlbum } from "@/types/album";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import { SpotifyAlbum } from "@/types/spotify";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const simplifyAlbumData = (data: SpotifyAlbum): SimplifiedAlbum => {
  const imageUrl = data.images[0]?.url;

  return {
    totalTracks: data.total_tracks,
    externalUrls: data.external_urls,
    id: data.id,
    images: data.images,
    name: data.name,
    releaseDate: data.release_date,
    artists: data.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    })),
    label: data.label,
    tracks: {
      href: data.tracks.href,
      limit: data.tracks.limit,
      next: data.tracks.next,
      offset: data.tracks.offset,
      previous: data.tracks.previous,
      total: data.tracks.total,
      items: data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        previewUrl: track.preview_url,
        imageUrl,
        popularity: track.popularity,
      })),
    },
  };
};

const validateAlbumData = (data: SpotifyAlbum): void => {
  if (!data.id || !data.name) {
    throw new SpotifyAPIError(
      "Invalid album data: missing required fields",
      502,
    );
  }

  if (!Array.isArray(data.tracks?.items)) {
    throw new SpotifyAPIError("Invalid album data: missing tracks", 502);
  }

  if (!Array.isArray(data.artists) || data.artists.length === 0) {
    throw new SpotifyAPIError("Invalid album data: missing artists", 502);
  }
};

const validateAlbumId = (albumId: unknown): string => {
  if (!albumId || typeof albumId !== "string") {
    throw new ValidationError("Invalid or missing album ID");
  }

  if (!albumId.match(/^[0-9A-Za-z]{22}$/)) {
    throw new ValidationError("Invalid Spotify album ID format");
  }

  return albumId;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AlbumResponseData>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { albumId } = req.query;
  const validatedAlbumId = validateAlbumId(albumId);

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get<SpotifyAlbum>(
      `/albums/${validatedAlbumId}`,
      {
        params: {
          market: process.env.SPOTIFY_MARKET || "US",
        },
      },
    );

    const { data } = response;

    validateAlbumData(data);

    const simplifiedAlbum = simplifyAlbumData(data);

    return res.status(200).json(simplifiedAlbum);
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 404:
          throw new SpotifyAPIError("Album not found", 404);
        case 429:
          throw new SpotifyAPIError("Rate limit exceeded", 429);
        case 401:
          throw new SpotifyAPIError("Unauthorized access", 401);
        case 403:
          throw new SpotifyAPIError("Access forbidden", 403);
        default:
          throw new SpotifyAPIError(
            `Failed to fetch album data: ${error.message}`,
            error.response?.status || 500,
          );
      }
    }

    if (error instanceof ValidationError || error instanceof SpotifyAPIError) {
      throw error;
    }

    throw new SpotifyAPIError(
      "An unexpected error occurred while fetching album data",
      500,
    );
  }
};

export default withErrorHandling(handler);
