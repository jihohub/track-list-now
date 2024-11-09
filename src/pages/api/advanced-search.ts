import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import { SpotifyAlbum } from "@/types/album";
import { SpotifyArtist } from "@/types/artist";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import {
  SearchResponseData,
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { SpotifyArtistBrief, SpotifyTrack } from "@/types/track";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const VALID_TYPES = ["artist", "track", "album"] as const;
type SearchType = (typeof VALID_TYPES)[number];

const simplifyArtists = (artists: SpotifyArtist[]): SimplifiedArtist[] => {
  return artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images[0]?.url,
    followers: artist.followers.total,
  }));
};

const simplifyTracks = (tracks: SpotifyTrack[]): SimplifiedTrack[] => {
  return tracks.map((track) => ({
    id: track.id,
    name: track.name,
    imageUrl: track.album.images[0]?.url,
    artists: track.artists
      .map((artist: SpotifyArtistBrief) => artist.name)
      .join(", "),
    previewUrl: track.preview_url,
    durationMs: track.duration_ms,
    popularity: track.popularity,
  }));
};

const simplifyAlbums = (albums: SpotifyAlbum[]): SimplifiedAlbum[] => {
  return albums.map((album) => ({
    id: album.id,
    name: album.name,
    imageUrl: album.images[0]?.url,
    artists: album.artists
      .map((artist: SpotifyArtistBrief) => artist.name)
      .join(", "),
    releaseDate: album.release_date,
  }));
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponseData>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { q, type, limit, offset } = req.query;

  if (typeof q !== "string" || q.trim().length === 0) {
    throw new ValidationError("Search query is required");
  }
  if (typeof type !== "string") {
    throw new ValidationError("Type parameter is required");
  }

  let requestedTypes = type.split(",").map((t) => t.trim());
  if (requestedTypes.includes("all")) {
    requestedTypes = [...VALID_TYPES];
  }

  const isValid = requestedTypes.every((t) =>
    VALID_TYPES.includes(t as SearchType),
  );
  if (!isValid) {
    throw new ValidationError("One or more search types are invalid");
  }

  const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
  const parsedOffset = typeof offset === "string" ? parseInt(offset, 10) : 0;

  if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    throw new ValidationError("Invalid limit value (must be between 1 and 50)");
  }

  if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
    throw new ValidationError("Invalid offset value");
  }
  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get("/search", {
      params: {
        q: q.trim(),
        type: requestedTypes.join(","),
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });

    const { data } = response;

    if (!data) {
      throw new SpotifyAPIError("Empty response from Spotify API", 502);
    }

    const responseData: SearchResponseData = {};

    if (data.artists && data.artists.items.length > 0) {
      responseData.artists = {
        items: simplifyArtists(data.artists.items),
        href: data.artists.href,
        limit: data.artists.limit,
        next: data.artists.next,
        offset: data.artists.offset,
        previous: data.artists.previous,
        total: data.artists.total,
      };
    }

    if (data.tracks && data.tracks.items.length > 0) {
      responseData.tracks = {
        items: simplifyTracks(data.tracks.items),
        href: data.tracks.href,
        limit: data.tracks.limit,
        next: data.tracks.next,
        offset: data.tracks.offset,
        previous: data.tracks.previous,
        total: data.tracks.total,
      };
    }

    if (data.albums && data.albums.items.length > 0) {
      responseData.albums = {
        items: simplifyAlbums(data.albums.items),
        href: data.albums.href,
        limit: data.albums.limit,
        next: data.albums.next,
        offset: data.albums.offset,
        previous: data.albums.previous,
        total: data.albums.total,
      };
    }

    if (Object.keys(responseData).length === 0) {
      return res.status(200).json({
        message: "No results found for the given query",
      } as SearchResponseData);
    }

    return res.status(200).json(responseData);
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      throw new SpotifyAPIError(
        `Spotify API request failed: ${error.message}`,
        statusCode,
      );
    }

    if (error instanceof ValidationError || error instanceof SpotifyAPIError) {
      throw error;
    }

    throw new SpotifyAPIError(
      "An unexpected error occurred during search",
      500,
    );
  }
};

export default withErrorHandling(handler);
