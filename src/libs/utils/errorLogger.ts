import { AppError } from "@/types/error";
import * as Sentry from "@sentry/nextjs";

const errorLogger = (error: Error, errorInfo?: React.ErrorInfo) => {
  Sentry.withScope((scope) => {
    if (errorInfo?.componentStack) {
      scope.setExtras({ componentStack: errorInfo.componentStack });
    }

    if (error instanceof AppError) {
      scope.setTags({
        severity: error.metadata.severity,
        errorCode: error.metadata.errorCode,
      });
      Object.entries(error.metadata).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
};

export default errorLogger;
