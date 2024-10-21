import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import {
  ArtistResponseData,
  CombinedArtistData,
  SpotifyArtist,
  SpotifyRelatedArtists,
  SpotifyTopTracks,
} from "@/types/artist";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ArtistResponseData>,
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
