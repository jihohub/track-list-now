import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ErrorResponse {
  error: string;
}

type Data = { access_token: string } | ErrorResponse;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res
      .status(500)
      .json({ error: "Missing Spotify client credentials" });
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data: TokenResponse = await response.json();

    if (data.access_token) {
      setCookie("access_token", data.access_token, {
        req,
        res,
        maxAge: data.expires_in,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return res.status(200).json({ access_token: data.access_token });
    }

    return res.status(400).json({ error: "Failed to retrieve access token" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
