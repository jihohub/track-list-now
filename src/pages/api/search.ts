import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import { SpotifyArtist } from "@/types/artist";
import {
  ResponseData,
  SimplifiedArtist,
  SimplifiedTrack,
  SpotifySearchResponse,
} from "@/types/search";
import { SpotifyArtistBrief, SpotifyTrack } from "@/types/track";
import type { NextApiRequest, NextApiResponse } from "next";

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
          albumImageUrl: track.album.images[0]?.url,
          name: track.name,
          artists: track.artists
            .map((artist: SpotifyArtistBrief) => artist.name)
            .join(", "),
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
