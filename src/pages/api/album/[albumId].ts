import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import { AlbumResponseData, SimplifiedAlbum } from "@/types/album";
import { SpotifyAlbum } from "@/types/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AlbumResponseData>,
) => {
  const { albumId } = req.query;

  // Validate albumId
  if (typeof albumId !== "string") {
    return res.status(400).json({ error: "Invalid album ID" });
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get<SpotifyAlbum>(`/albums/${albumId}`, {
      params: {
        market: "US", // 필요한 시장 코드로 변경 가능
      },
    });

    const { data } = response;

    // 앨범의 첫 번째 이미지 URL 가져오기 (없을 경우 기본 이미지 사용)
    const albumImageUrl = data.images[0]?.url;

    // Simplify album data
    const simplifiedAlbum: SimplifiedAlbum = {
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
          durationMs: track.duration_ms,
          albumImageUrl,
        })),
      },
    };

    return res.status(200).json(simplifiedAlbum);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;
