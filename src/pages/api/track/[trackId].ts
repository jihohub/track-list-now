import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import { TrackDetail } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  error: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TrackDetail | ErrorResponse>,
) => {
  const { trackId } = req.query;

  if (!trackId || typeof trackId !== "string") {
    return res.status(400).json({ error: "Invalid or missing trackId" });
  }

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get(`/tracks/${trackId}`, {});

    const { data } = response;
    return res.status(200).json(data);
  } catch (error) {
    // Spotify API 에러 메시지 전달
    if (error.response && error.response.data && error.response.data.error) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export default handler;
