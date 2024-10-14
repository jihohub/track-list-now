import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import type { NextApiRequest, NextApiResponse } from "next";

interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

interface SpotifyArtistBrief {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

interface SpotifyTrack {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: {
      reason: string;
    };
    type: "album";
    uri: string;
    artists: SpotifyArtistBrief[];
  };
  artists: SpotifyArtistBrief[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean?: string;
    upc?: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: unknown;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

interface SpotifyTopTracks {
  tracks: SpotifyTrack[];
}

interface SpotifyRelatedArtists {
  artists: SpotifyArtist[];
}

interface CombinedArtistData {
  artist: SpotifyArtist;
  topTracks: SpotifyTopTracks;
  relatedArtists: SpotifyRelatedArtists;
}

interface ErrorResponse {
  error: string;
}

type ResponseData = CombinedArtistData | ErrorResponse;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { artistId } = req.query;

  if (!artistId || typeof artistId !== "string") {
    return res.status(400).json({ error: "Invalid or missing artistId" });
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);

    const artistResponse = await serverAxios.get<SpotifyArtist>(
      `/artists/${artistId}`,
    );
    const artistData = artistResponse.data;

    // 아티스트 탑 트랙 Fetch
    const topTracksResponse = await serverAxios.get<SpotifyTopTracks>(
      `/artists/${artistId}/top-tracks`,
      {
        params: {
          market: "US",
        },
      },
    );
    const topTracksData = topTracksResponse.data;

    // 연관 아티스트 Fetch
    const relatedArtistsResponse = await serverAxios.get<SpotifyRelatedArtists>(
      `/artists/${artistId}/related-artists`,
    );
    const relatedArtistsData = relatedArtistsResponse.data;

    // 모든 데이터를 결합
    const combinedData: CombinedArtistData = {
      artist: artistData,
      topTracks: topTracksData,
      relatedArtists: relatedArtistsData,
    };

    return res.status(200).json(combinedData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
