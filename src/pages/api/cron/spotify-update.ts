import ErrorProcessor from "@/libs/utils/errorProcessor";
import SpotifyDataUpdater from "@/services/spotify-updater";
import { AppError } from "@/types/error";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = crypto.randomUUID();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Vercel Cron 보안 검증
    const authHeader = req.headers.authorization;

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

    // 현재 호스트 URL 구성
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = req.headers.host || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

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
    const updater = new SpotifyDataUpdater(baseUrl);

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

    return res.status(200).json({
      success: true,
      message: "Spotify data update completed",
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    ErrorProcessor.logToSentry(error);

    return res.status(500).json({
      success: false,
      error: "Failed to update Spotify data",
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}

// 메모리 제한과 타임아웃 설정을 위한 설정
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};

export default handler;
