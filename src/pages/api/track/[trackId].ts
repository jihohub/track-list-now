import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import { SpotifyTrack, TrackResponseData } from "@/types/track";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TrackResponseData>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { trackId } = req.query;

  if (!trackId || typeof trackId !== "string") {
    throw new ValidationError("Invalid or missing trackId");
  }

  if (!trackId.match(/^[0-9A-Za-z]{22}$/)) {
    throw new ValidationError("Invalid Spotify track ID format");
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get<SpotifyTrack>(`/tracks/${trackId}`);

    const trackData = response.data;

    if (!trackData) {
      throw new SpotifyAPIError("Empty response from Spotify API", 502);
    }

    if (!trackData.id || !trackData.name) {
      throw new SpotifyAPIError("Invalid track data from Spotify API", 502);
    }

    return res.status(200).json(trackData);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 404:
          throw new SpotifyAPIError("Track not found", 404);
        case 429:
          throw new SpotifyAPIError("Rate limit exceeded", 429);
        case 401:
          throw new SpotifyAPIError("Unauthorized access", 401);
        case 403:
          throw new SpotifyAPIError("Access forbidden", 403);
        default:
          throw new SpotifyAPIError(
            `Spotify API request failed: ${error.message}`,
            error.response?.status || 500,
          );
      }
    }

    if (error instanceof ValidationError || error instanceof SpotifyAPIError) {
      throw error;
    }

    throw new SpotifyAPIError(
      "An unexpected error occurred while fetching track data",
      500,
    );
  }
};

export default withErrorHandling(handler);
