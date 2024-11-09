import ErrorFallback from "@/features/common/components/ErrorFallback";
import ErrorProcessor from "@/libs/utils/errorProcessor";
import * as Sentry from "@sentry/nextjs";
import { ReactNode } from "react";

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

interface FallbackProps {
  error: unknown;
  resetError: () => void;
}

const processError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error(
    typeof error === "object" ? JSON.stringify(error) : String(error),
  );
};

const SentryFallback = ({ error, resetError }: FallbackProps) => (
  <ErrorFallback
    error={processError(error)}
    resetErrorBoundary={() => {
      Sentry.withScope((scope) => {
        scope.setTag("action", "error_reset");
        Sentry.captureMessage("Error boundary reset");
      });
      resetError();
    }}
  />
);

const ErrorBoundaryWrapper = ({ children }: ErrorBoundaryWrapperProps) => {
  const handleError = (error: unknown, componentStack: string | undefined) => {
    ErrorProcessor.logToSentry(error, componentStack);
  };

  return (
    <Sentry.ErrorBoundary fallback={SentryFallback} onError={handleError}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
