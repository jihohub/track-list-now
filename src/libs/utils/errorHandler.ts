import { AppError } from "@/types/error";
import * as Sentry from "@sentry/nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const withErrorHandling =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setExtra("requestUrl", req.url);
        scope.setExtra("requestMethod", req.method);
        scope.setExtra("requestQuery", req.query);

        if (error instanceof AppError) {
          scope.setTag("error.type", error.name);
          scope.setTag("error.code", error.metadata.errorCode);
          scope.setLevel(error.metadata.severity);
          scope.setExtras(error.metadata);
        }

        Sentry.captureException(error);
      });

      const statusCode =
        error instanceof AppError ? error.getStatusCode() : 500;

      return res.status(statusCode).json({
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        errorCode:
          error instanceof AppError
            ? error.metadata.errorCode
            : "UNKNOWN_ERROR",
        requestId: res.getHeader("x-request-id") || crypto.randomUUID(),
      });
    }
  };

export default withErrorHandling;
