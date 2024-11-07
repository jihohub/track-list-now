import { SpotifyToken } from "@/types/spotify";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import SPOTIFY_CONSTANTS from "./constants/spotify";

// Spotify 액세스 토큰을 가져오는 함수
const fetchSpotifyAccessToken = async (): Promise<SpotifyToken | null> => {
  const { clientId, clientSecret } = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  };

  if (!clientId || !clientSecret) {
    Sentry.captureMessage(
      SPOTIFY_CONSTANTS.ERROR_MESSAGES.MISSING_CREDENTIALS,
      {
        level: "error",
        tags: { service: "spotify" },
      },
    );
    return null;
  }

  try {
    const response = await fetch(SPOTIFY_CONSTANTS.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      throw new Error(`Spotify token fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("service", "spotify");
      scope.setTag("operation", "token_fetch");
      scope.setExtra("spotifyClientIdExists", !!clientId);

      if (error instanceof Error) {
        Sentry.captureException(error);
      }
    });
    return null;
  }
};

// 에러 응답 생성 함수
/* eslint-disable default-param-last */
const createErrorResponse = (
  message: string,
  status = 500,
  error?: Error,
): NextResponse => {
  const errorId = crypto.randomUUID();

  Sentry.withScope((scope) => {
    scope.setTag("type", "middleware_error");
    scope.setTag("error_id", errorId);
    scope.setLevel(status >= 500 ? "error" : "warning");

    if (error) {
      scope.setExtra("originalError", error);
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(message);
    }
  });

  return new NextResponse(
    JSON.stringify({
      error: message,
      errorId,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

// 토큰이 포함된 응답 생성
function createResponseWithToken(
  req: NextRequest,
  token: string,
): NextResponse {
  const headers = new Headers(req.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};

// 쿠키 설정 유틸리티
const setCookies = (
  response: NextResponse,
  token: SpotifyToken,
  now: number,
): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
    maxAge: token.expires_in,
  };

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

// Spotify 요청 처리 함수
async function handleSpotifyRequest(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(
    SPOTIFY_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN,
  )?.value;
  const tokenExpiry = req.cookies.get(
    SPOTIFY_CONSTANTS.COOKIE_NAMES.TOKEN_EXPIRY,
  )?.value;
  const now = Date.now();

  if (accessToken && tokenExpiry && now < parseInt(tokenExpiry, 10)) {
    return createResponseWithToken(req, accessToken);
  }

  const newToken = await fetchSpotifyAccessToken();
  if (!newToken) {
    return createErrorResponse(
      SPOTIFY_CONSTANTS.ERROR_MESSAGES.TOKEN_FETCH_FAILED,
      500,
    );
  }

  const response = createResponseWithToken(req, newToken.access_token);
  setCookies(response, newToken, now);

  return response;
}

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    if (!pathname.startsWith(SPOTIFY_CONSTANTS.PATHS.API)) {
      return NextResponse.next();
    }

    // 요청 정보 로깅
    Sentry.addBreadcrumb({
      category: "request",
      message: "API request",
      level: "info",
      data: {
        url: req.url,
        method: req.method,
        pathname,
      },
    });

    if (pathname.startsWith(SPOTIFY_CONSTANTS.PATHS.SPOTIFY_API)) {
      return await handleSpotifyRequest(req);
    }

    return NextResponse.next();
  } catch (error) {
    return createErrorResponse(
      SPOTIFY_CONSTANTS.ERROR_MESSAGES.UNEXPECTED_ERROR,
      500,
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
