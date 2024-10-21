import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import { SpotifyTrack, TrackResponseData } from "@/types/track";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TrackResponseData>,
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
