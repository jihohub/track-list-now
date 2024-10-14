import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import type { NextApiRequest, NextApiResponse } from "next";

interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyRestrictions {
  reason: string;
}

interface SpotifyArtistBrief {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

interface SpotifyExternalIds {
  isrc: string;
  ean?: string;
  upc?: string;
}

interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictions;
  type: "album";
  uri: string;
  artists: SpotifyArtistBrief[];
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtistBrief[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: unknown;
  restrictions?: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

type SuccessResponse = SpotifyTrack;

interface ErrorResponse {
  error: string;
}

type ResponseData = SuccessResponse | ErrorResponse;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { trackId } = req.query;

  if (!trackId || typeof trackId !== "string") {
    return res.status(400).json({ error: "Invalid or missing trackId" });
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get<SpotifyTrack>(
      `/tracks/${trackId}`,
      {},
    );

    const trackData = response.data;

    return res.status(200).json(trackData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
