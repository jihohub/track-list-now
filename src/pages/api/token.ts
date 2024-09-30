import { setCookie } from "cookies-next";

export default async function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id,
      client_secret,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    setCookie("access_token", data.access_token, {
      req,
      res,
      maxAge: data.expires_in,
    });
    res.status(200).json({ access_token: data.access_token });
  } else {
    res.status(400).json({ error: "Failed to retrieve access token" });
  }
}
