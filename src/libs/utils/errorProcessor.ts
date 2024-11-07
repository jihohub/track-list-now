import errorLogger from "@/libs/utils/errorLogger";
import { AppError } from "@/types/error";
import * as Sentry from "@sentry/nextjs";

class ErrorProcessor {
  static processError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error(
      typeof error === "object" ? JSON.stringify(error) : String(error),
    );
  }

  static logToSentry(error: unknown, componentStack?: string) {
    const processedError = this.processError(error);

    Sentry.withScope((scope) => {
      scope.setTag("errorType", processedError.name);
      scope.setExtra("componentStack", componentStack);

      if (error instanceof Error) {
        const appError = new AppError(error.message, {
          severity: "fatal",
          componentStack,
          metadata: {
            errorName: error.name,
            errorStack: error.stack,
          },
        });

        scope.setExtra("originalError", error);
        errorLogger(appError, { componentStack });
      } else {
        Sentry.captureException(processedError);
      }
    });
  }
}

export default ErrorProcessor;
