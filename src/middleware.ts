import { NextRequest, NextResponse } from "next/server";

// Spotify 액세스 토큰을 가져오는 함수
const fetchSpotifyAccessToken = async (): Promise<{
  access_token: string;
  expires_in: number;
} | null> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return { access_token: data.access_token, expires_in: data.expires_in };
};

// 미들웨어 함수
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const spotifyApiPaths = ["/api/search", "/api/artist", "/api/track"];
  const isSpotifyApi = spotifyApiPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!isSpotifyApi) {
    return NextResponse.next();
  }

  // 쿠키에서 액세스 토큰과 만료 시간 가져오기
  const accessToken = req.cookies.get("spotify_access_token")?.value;
  const tokenExpiry = req.cookies.get("spotify_token_expiry")?.value;

  const now = Date.now();

  if (accessToken && tokenExpiry && now < parseInt(tokenExpiry, 10)) {
    // 토큰이 유효하면 헤더에 추가
    const modifiedHeaders = new Headers(req.headers);
    modifiedHeaders.set("Authorization", `Bearer ${accessToken}`);

    const response = NextResponse.next({
      request: {
        headers: modifiedHeaders,
      },
    });

    return response;
  }

  // 토큰이 없거나 만료된 경우 새 토큰 발급
  const newToken = await fetchSpotifyAccessToken();

  if (!newToken) {
    // 토큰 발급 실패 시 500 에러 반환
    return new NextResponse("Failed to fetch Spotify access token", {
      status: 500,
    });
  }

  const newAccessToken = newToken.access_token;
  const expiresIn = newToken.expires_in;

  // 새 토큰과 만료 시간 쿠키에 설정
  const response = NextResponse.next();

  // 쿠키 설정
  response.cookies.set("spotify_access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
    sameSite: "lax",
  });

  response.cookies.set(
    "spotify_token_expiry",
    (now + expiresIn * 1000).toString(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
    },
  );

  // 헤더에 새 토큰 추가
  const modifiedHeaders = new Headers(req.headers);
  modifiedHeaders.set("Authorization", `Bearer ${newAccessToken}`);

  // 응답에 수정된 헤더 적용
  const finalResponse = NextResponse.rewrite(req.nextUrl, {
    headers: modifiedHeaders,
  });

  return finalResponse;
}

// 미들웨어가 동작할 경로 지정
export const config = {
  matcher: ["/api/spotify/:path*"],
};
