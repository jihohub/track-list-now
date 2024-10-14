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

interface SpotifyArtistSearchResponse {
  artists: {
    items: SpotifyArtist[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

interface SpotifyTrackSearchResponse {
  tracks: {
    items: SpotifyTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

type SpotifySearchResponse =
  | SpotifyArtistSearchResponse
  | SpotifyTrackSearchResponse;

interface SimplifiedArtist {
  imageUrl: string;
  name: string;
  id: string;
  followers: number;
}

interface SimplifiedTrack {
  albumImageUrl: string;
  name: string;
  artists: string;
  id: string;
  popularity: number;
}

type SimplifiedSearchResponse =
  | {
      artists: {
        items: SimplifiedArtist[];
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
      };
    }
  | {
      tracks: {
        items: SimplifiedTrack[];
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
      };
    };

interface ErrorResponse {
  error: string;
}

type ResponseData = SimplifiedSearchResponse | ErrorResponse;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { q, type } = req.query;

  if (
    typeof q !== "string" ||
    typeof type !== "string" ||
    !["artist", "track"].includes(type)
  ) {
    return res.status(400).json({ error: "Invalid query or type" });
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

    if (type === "artist" && "artists" in data) {
      const simplifiedArtists: SimplifiedArtist[] = data.artists.items.map(
        (artist) => ({
          imageUrl: artist.images[0]?.url || "/default-artist.png",
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
        (track) => ({
          albumImageUrl: track.album.images[0]?.url || "/default-album.png",
          name: track.name,
          artists: track.artists.map((artist) => artist.name).join(", "),
          id: track.id,
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
    return res.status(400).json({ error: "Invalid response data" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
