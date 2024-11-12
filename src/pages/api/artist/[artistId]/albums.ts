import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import withErrorHandling from "@/libs/utils/errorHandler";
import { ArtistAlbumsResponse } from "@/types/artist";
import { SpotifyAPIError, ValidationError } from "@/types/error";
import { NextApiRequest, NextApiResponse } from "next";

const validateArtistId = (artistId: unknown): string => {
  if (!artistId || typeof artistId !== "string") {
    throw new ValidationError("Invalid or missing artistId");
  }

  if (!artistId.match(/^[0-9A-Za-z]{22}$/)) {
    throw new ValidationError("Invalid Spotify artist ID format");
  }

  return artistId;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ArtistAlbumsResponse>,
) => {
  if (req.method !== "GET") {
    throw new ValidationError("Method not allowed");
  }

  const { artistId } = req.query;
  const { limit = "10", offset = "0" } = req.query;

  const validatedArtistId = validateArtistId(artistId);
  const parsedLimit = Math.min(50, Math.max(1, Number(limit)));
  const parsedOffset = Math.max(0, Number(offset));

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get(
      `/artists/${validatedArtistId}/albums`,
      {
        params: {
          limit: parsedLimit,
          offset: parsedOffset,
          market: process.env.SPOTIFY_MARKET || "US",
        },
      },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SpotifyAPIError) {
      throw error;
    }

    throw new SpotifyAPIError(
      "An unexpected error occurred while fetching artist albums",
      500,
    );
  }
};

export default withErrorHandling(handler);
