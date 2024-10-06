import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

const ErrorBoundaryWrapper = ({ children }: ErrorBoundaryWrapperProps) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // TODO: 리셋 시 동작
      window.location.reload();
    }}
    onError={(error, info) => {
      // TODO: 추후 Sentry 연결 가능
      console.error("에러 발생:", error, info);
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundaryWrapper;
