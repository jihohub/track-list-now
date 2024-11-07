import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import {
  ArtistPageData,
  SpotifyArtist,
  SpotifyRelatedArtists,
  SpotifyTopTracks,
} from "@/types/artist";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import { AxiosError, AxiosInstance } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handleSpotifyError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 404:
        throw new SpotifyAPIError("Artist not found", 404);
      case 429:
        throw new SpotifyAPIError("Rate limit exceeded", 429);
      case 401:
        throw new SpotifyAPIError("Unauthorized access", 401);
      case 403:
        throw new SpotifyAPIError("Access forbidden", 403);
      default:
        throw new SpotifyAPIError(
          `${defaultMessage}: ${error.message}`,
          error.response?.status || 500,
        );
    }
  }
  throw new SpotifyAPIError(defaultMessage, 500);
};

const fetchArtistData = async (
  axios: AxiosInstance,
  artistId: string,
): Promise<SpotifyArtist> => {
  try {
    const response = await axios.get<SpotifyArtist>(`/artists/${artistId}`);
    return response.data;
  } catch (error) {
    throw handleSpotifyError(error, "Failed to fetch artist data");
  }
};

const fetchTopTracks = async (
  axios: AxiosInstance,
  artistId: string,
): Promise<SpotifyTopTracks> => {
  try {
    const response = await axios.get<SpotifyTopTracks>(
      `/artists/${artistId}/top-tracks`,
      {
        params: { market: "US" },
      },
    );
    return response.data;
  } catch (error) {
    throw handleSpotifyError(error, "Failed to fetch top tracks");
  }
};

const fetchRelatedArtists = async (
  axios: AxiosInstance,
  artistId: string,
): Promise<SpotifyRelatedArtists> => {
  try {
    const response = await axios.get<SpotifyRelatedArtists>(
      `/artists/${artistId}/related-artists`,
    );
    return response.data;
  } catch (error) {
    throw handleSpotifyError(error, "Failed to fetch related artists");
  }
};

const validateArtistId = (artistId: unknown): string => {
  if (!artistId || typeof artistId !== "string") {
    throw new ValidationError("Invalid or missing artistId");
  }

  if (!artistId.match(/^[0-9A-Za-z]{22}$/)) {
    throw new ValidationError("Invalid Spotify artist ID format");
  }

  return artistId;
};

const validateResponse = (data: ArtistPageData): void => {
  if (!data.artist || !data.artist.id) {
    throw new SpotifyAPIError("Invalid artist data", 502);
  }

  if (!data.topTracks || !Array.isArray(data.topTracks.tracks)) {
    throw new SpotifyAPIError("Invalid top tracks data", 502);
  }

  if (!data.relatedArtists || !Array.isArray(data.relatedArtists.artists)) {
    throw new SpotifyAPIError("Invalid related artists data", 502);
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ArtistPageData>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { artistId } = req.query;
  const validatedArtistId = validateArtistId(artistId);

  try {
    const serverAxios = getServerAxiosInstance(req, res);

    const [artistData, topTracksData, relatedArtistsData] = await Promise.all([
      fetchArtistData(serverAxios, validatedArtistId),
      fetchTopTracks(serverAxios, validatedArtistId),
      fetchRelatedArtists(serverAxios, validatedArtistId),
    ]);

    const combinedData: ArtistPageData = {
      artist: {
        id: artistData.id,
        name: artistData.name,
        images: artistData.images,
        genres: artistData.genres,
        followers: artistData.followers,
      },
      topTracks: {
        tracks: topTracksData.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          imageUrl: track.album.images[0]?.url || "",
          artists: track.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
          previewUrl: track.preview_url,
          durationMs: track.duration_ms,
        })),
      },
      relatedArtists: {
        artists: relatedArtistsData.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
          images: artist.images,
        })),
      },
    };

    validateResponse(combinedData);

    return res.status(200).json(combinedData);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SpotifyAPIError) {
      throw error;
    }

    throw new SpotifyAPIError(
      "An unexpected error occurred while fetching artist data",
      500,
    );
  }
};

export default withErrorHandling(handler);
