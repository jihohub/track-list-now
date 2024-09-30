import axios from "axios";
import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  const { query, type } = req.query;

  try {
    const accessToken = getCookie("access_token", { req, res });

    if (!accessToken) {
      return res.status(401).json({ error: "No access token provided" });
    }

    // Spotify API에 검색 요청
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=${type}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data } = response;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
}
