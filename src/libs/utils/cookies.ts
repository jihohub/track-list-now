import SPOTIFY_CONSTANTS from "@/constants/spotify";
import { SpotifyToken } from "@/types/spotify";
import { NextResponse } from "next/server";

export const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  maxAge,
});

export const setSpotifyTokenCookies = (
  response: NextResponse,
  token: SpotifyToken,
  now: number,
): void => {
  const cookieOptions = getCookieOptions(token.expires_in);

  response.cookies.set(
    SPOTIFY_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN,
    token.access_token,
    cookieOptions,
  );

  response.cookies.set(
    SPOTIFY_CONSTANTS.COOKIE_NAMES.TOKEN_EXPIRY,
    (now + token.expires_in * 1000).toString(),
    cookieOptions,
  );
};
