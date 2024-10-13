import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { artistId } = req.query;

  if (!artistId || typeof artistId !== "string") {
    return res.status(400).json({ error: "Invalid or missing artistId" });
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);

    const artistResponse = await serverAxios.get(`/artists/${artistId}`);
    const artistData = artistResponse.data;

    // 아티스트 탑 트랙 Fetch
    const topTracksResponse = await serverAxios.get(
      `/artists/${artistId}/top-tracks`,
      {
        params: {
          market: "US",
        },
      },
    );
    const topTracksData = topTracksResponse.data;

    // 연관 아티스트 Fetch
    const relatedArtistsResponse = await serverAxios.get(
      `/artists/${artistId}/related-artists`,
    );
    const relatedArtistsData = relatedArtistsResponse.data;

    // 모든 데이터를 결합
    const combinedData = {
      artist: artistData,
      topTracks: topTracksData,
      relatedArtists: relatedArtistsData,
    };

    return res.status(200).json(combinedData);
  } catch (error) {
    // Spotify API 에러 메시지 전달
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.error) {
        return res
          .status(error.response.status)
          .json({ error: error.response.data.error.message });
      }
    }

    return res.status(500).json({ error: "Failed to fetch artist details" });
  }
};

export default handler;
