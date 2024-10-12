// /pages/api/search.ts
import getServerAxiosInstance from "@/libs/axios/axiosServerInstance";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
}
