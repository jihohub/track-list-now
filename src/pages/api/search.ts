import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, type } = req.query;

  try {
    const serverAxios = getServerAxiosInstance(req, res);
    const response = await serverAxios.get("/search", {
      params: {
        q: query,
        type,
        limit: 50,
      },
    });

    const { data } = response;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
