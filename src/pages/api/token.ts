import withErrorHandling from "@/libs/utils/errorHandler";
import { APIError } from "@/types/error";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

type Data = { access_token: string };

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "POST") {
    throw new APIError("Method not allowed", {
      statusCode: 405,
      errorCode: "METHOD_NOT_ALLOWED",
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new APIError("Missing Spotify client credentials", {
      statusCode: 500,
      errorCode: "MISSING_CREDENTIALS",
    });
  }

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

  if (!data.access_token) {
    throw new APIError("Failed to retrieve access token", {
      statusCode: 400,
      errorCode: "TOKEN_RETRIEVAL_FAILED",
    });
  }

  setCookie("access_token", data.access_token, {
    req,
    res,
    maxAge: data.expires_in,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.status(200).json({ access_token: data.access_token });
};

export default withErrorHandling(handler);
