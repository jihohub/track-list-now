import ErrorProcessor from "@/libs/utils/errorProcessor";
import { SpotifyDataUpdater } from "@/services/spotify-updater";
import { AppError } from "@/types/error";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const requestId = crypto.randomUUID();

  try {
    // Vercel Cron 보안 검증
    const headersList = headers();
    const authHeader = headersList.get("authorization");

    if (
      process.env.VERCEL_CRON_SECRET &&
      authHeader !== `Bearer ${process.env.VERCEL_CRON_SECRET}`
    ) {
      throw new AppError("Unauthorized cron job access", {
        errorCode: "UNAUTHORIZED_CRON",
        severity: "warning",
        metadata: {
          requestId,
          header: authHeader,
        },
      });
    }

    ErrorProcessor.logToSentry(
      new AppError("Starting Spotify data update cron job", {
        errorCode: "CRON_JOB_STARTED",
        severity: "info",
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      }),
    );

    // SpotifyDataUpdater 인스턴스 생성
    const updater = new SpotifyDataUpdater(request as any, response as any);

    // 순차적으로 업데이트 실행
    await updater.updateAllArtists();
    await updater.updateAllTracks();

    ErrorProcessor.logToSentry(
      new AppError("Spotify data update completed successfully", {
        errorCode: "CRON_JOB_COMPLETED",
        severity: "info",
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Spotify data update completed",
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    ErrorProcessor.logToSentry(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update Spotify data",
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export const maxDuration = 300; // 최대 실행 시간 5분

// Vercel Edge Config에서 크론 작업 설정을 위한 설정
export const config = {
  maxDuration: 300,
  memory: 1024, // 메모리 제한 1GB
};
