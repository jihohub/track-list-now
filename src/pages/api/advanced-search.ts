import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import { SpotifyAlbum } from "@/types/album";
import { SpotifyArtist } from "@/types/artist";
import {
  SearchResponseData,
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedTrack,
} from "@/types/search";
import { SpotifyArtistBrief, SpotifyTrack } from "@/types/track";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponseData | { error: string }>,
) => {
  const { q, type, limit, offset } = req.query;

  if (typeof q !== "string" || typeof type !== "string") {
    return res.status(400).json({ error: "Invalid query or type parameter" });
  }

  let requestedTypes = type.split(",").map((t) => t.trim());
  if (requestedTypes.includes("all")) {
    requestedTypes = ["artist", "track", "album"];
  }

  const validTypes = ["artist", "track", "album"];
  const isValid = requestedTypes.every((t) => validTypes.includes(t));
  if (!isValid) {
    return res.status(400).json({ error: "One or more types are invalid" });
  }

  const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
  const parsedOffset = typeof offset === "string" ? parseInt(offset, 10) : 0;

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get("/search", {
      params: {
        q,
        type: requestedTypes.join(","),
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });

    const { data } = response;

    const responseData: SearchResponseData = {};

    if (data.artists) {
      const simplifiedArtists: SimplifiedArtist[] = data.artists.items.map(
        (artist: SpotifyArtist) => ({
          id: artist.id,
          name: artist.name,
          image_url: artist.images[0]?.url,
          followers: artist.followers.total,
        }),
      );

      responseData.artists = {
        items: simplifiedArtists,
        href: data.artists.href,
        limit: data.artists.limit,
        next: data.artists.next,
        offset: data.artists.offset,
        previous: data.artists.previous,
        total: data.artists.total,
      };
    }

    if (data.tracks) {
      const simplifiedTracks: SimplifiedTrack[] = data.tracks.items.map(
        (track: SpotifyTrack) => ({
          id: track.id,
          name: track.name,
          album_image_url: track.album.images[0]?.url,
          artists: track.artists
            .map((artist: SpotifyArtistBrief) => artist.name)
            .join(", "),
          popularity: track.popularity,
        }),
      );

      responseData.tracks = {
        items: simplifiedTracks,
        href: data.tracks.href,
        limit: data.tracks.limit,
        next: data.tracks.next,
        offset: data.tracks.offset,
        previous: data.tracks.previous,
        total: data.tracks.total,
      };
    }

    if (data.albums) {
      const simplifiedAlbums: SimplifiedAlbum[] = data.albums.items.map(
        (album: SpotifyAlbum) => ({
          id: album.id,
          name: album.name,
          album_image_url: album.images[0]?.url,
          artists: album.artists
            .map((artist: SpotifyArtistBrief) => artist.name)
            .join(", "),
          release_date: album.release_date,
        }),
      );

      responseData.albums = {
        items: simplifiedAlbums,
        href: data.albums.href,
        limit: data.albums.limit,
        next: data.albums.next,
        offset: data.albums.offset,
        previous: data.albums.previous,
        total: data.albums.total,
      };
    }

    return res.status(200).json(responseData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
